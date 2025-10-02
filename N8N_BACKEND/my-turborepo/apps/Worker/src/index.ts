import { Kafka, type Consumer, type Producer } from "kafkajs";
import {prisma} from '@myorg/database'
import { SendEmail } from './apps/Gmail.js';
import { sendMessageTelegram } from './apps/Telegram.js'


const kafka = new Kafka({
    clientId: "newKafka",
    brokers: ["localhost:9092"]
})


let producer: Producer;
async function CreateProducer(): Promise<Producer> {
    if (producer) return producer;

    producer = kafka.producer();
    await producer.connect().catch((error) => console.log("producer connection failed", error.meassage));
    return producer;

}

let consumer: Consumer;

async function getConsumer(groupId = "default-group") {
    if (consumer) return consumer;

    consumer = kafka.consumer({ groupId });

    await consumer.connect();
    console.log("Kafka Consumer connected ✅");

    return consumer;
}

interface MessageFromProcesser {
    type: String
    Run: {
        id: Number,
        StapsRunId: Number,
        createdAt: String,
        updatedAt: String
    },
    stage: Number
}

interface MessageFromWorker {
    type: String,
    UserMetaData: Object
    WorkFlowID: Number
    stage: Number

}
/*

                console.log("your data is : --", data);

                const StapsRunData = await prisma.StapsRun.findUnique({
                    where: {
                        id: data.zapRun.StapsRunId
                    }
                })
                console.log(StapsRunData);
*/

async function workExecute() {
    try {
        const consumerForOrder = await getConsumer("N8N-CLONE")
        await consumerForOrder.subscribe({
            topic: "TREAD_DATA",
            fromBeginning: true
        })
     
        consumerForOrder.run({
            autoCommit: true,
            eachMessage: async ({ topic, partition, message }) => {
                console.log(" Offset:", message.offset);
                console.log(" Raw Message:", message.value?.toString());

                let data: MessageFromProcesser | MessageFromWorker;
                try {
                    data = JSON.parse(message.value?.toString() || "{}");
                } catch (err) {
                    console.error(" JSON parse failed", err);
                    return;
                }

                if (data.type === "MessageFromProcesser") {
                    if (!("Run" in data) || !data.Run?.StapsRunId) {
                        console.error(" Missing Run/StapsRunId in message", data);
                        return;
                    }

                    const StapsRunData = await prisma.StapsRun.findUnique({
                        where: { id: data.Run.StapsRunId },
                    });

                    if (!StapsRunData) {
                        console.error(" StapsRunData not found for", data.Run.StapsRunId);
                        return;
                    }

                    const userData: any = StapsRunData.metaData;

                    const FindStaps = await prisma.staps.findFirst({
                        where: {
                            AND: [
                                { index: data.stage } as any,
                                { workflowId: StapsRunData.WorkFlowId },
                            ],
                        },
                    });
                    if (!FindStaps) {
                        return
                    }

                    if (FindStaps?.name === "TELEGRAM") {
                        const metadata = FindStaps.metadata as { TOKEN: string; CHAT_ID: string };
                        const ok = await sendMessageTelegram(metadata.TOKEN, metadata.CHAT_ID, JSON.stringify(userData));
                        console.log(ok ? " Telegram sent" : " Telegram failed");
                    } else if (FindStaps?.name === "GMAIL") {
                        const metadata = FindStaps.metadata as { email: string; password: string };
                        const ok = await SendEmail(metadata.email, metadata.password, userData.email, userData.message);
                        console.log(ok ? " Email sent" : " Email failed");
                    }


                    const NextDataObject: MessageFromWorker = {
                        type: 'MessageFromWorker',
                        UserMetaData: userData,
                        WorkFlowID: StapsRunData.WorkFlowId,

                        stage: data.stage as any + 1
                    }

                    const producer = await CreateProducer();
                    producer.send({
                        topic: "TREAD_DATA",
                        messages: [{
                            value: JSON.stringify(NextDataObject)
                        }]
                    })

                } else if (data.type === "MessageFromWorker") {

                    console.log("👷 Worker message:", data);

                    const FindStaps = await prisma.staps.findFirst({
                        where: {
                            AND: [
                                { index: data.stage } as any,
                                { workflowId: (data as MessageFromWorker).WorkFlowID } as any,
                            ],
                        },
                    });
                    if (!FindStaps) {
                        return
                    }

                    if (FindStaps?.name === "TELEGRAM") {
                        const metadata = FindStaps.metadata as { TOKEN: string; CHAT_ID: string };
                        const ok = await sendMessageTelegram(metadata.TOKEN, metadata.CHAT_ID, JSON.stringify((data as MessageFromWorker).UserMetaData));
                        console.log(ok ? " Telegram sent" : " Telegram failed");
                    } else if (FindStaps?.name === "GMAIL") {
                        const metadata = FindStaps.metadata as { email: string; password: string };
                        // @ts-ignore
                        const ok = await SendEmail(metadata.email, metadata.password, (data as MessageFromWorker).UserMetaData.email as any | undefined, (data as MessageFromWorker).UserMetaData.message);
                        console.log(ok ? " Email sent" : " Email failed");
                    }

                    const NextDataObject: MessageFromWorker = {
                        type: 'MessageFromWorker',
                        UserMetaData: (data as MessageFromWorker).UserMetaData,
                        WorkFlowID: (data as MessageFromWorker).WorkFlowID,

                        stage: data.stage as any + 1
                    }

                    const producer = await CreateProducer();
                    producer.send({
                        topic: "TREAD_DATA",
                        messages: [{
                            value: JSON.stringify(NextDataObject)
                        }]
                    })
                } else {
                    console.log("⚠️ Unknown message type:", data);
                }

                // ✅ Commit offset after processing
                await consumer.commitOffsets([
                    { topic, partition, offset: (parseInt(message.offset) + 1).toString() },
                ]);
                console.log(`💾 Committed offset: ${parseInt(message.offset) + 1}`);
            },
        });



    } catch (error: any) {

        return error.meassage

    }

}

workExecute();