import { Kafka } from "kafkajs";
import {prisma} from '@myorg/database'



const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "newKafka",
    brokers: [process.env.KAFKA_BROKERS_NAME  || 'localhost:9092']
})

const producer = kafka.producer();
await producer.connect().catch((error) => {
    console.log("kafka connection terminated")
})

async function ProcessAllData() {
    try {
        while (true) {
            console.log("data");
            const findOutboxRun = await prisma.outBoxStapsRun.findMany({
                where: {},
                take: 5
            })

            console.log(findOutboxRun);

            findOutboxRun.map((data: { id: any }) => {
                producer.send({
                    topic: process.env.KAFKA_TOPIC || "TREAD_DATA",
                    messages: [{
                        value: JSON.stringify({
                            type: "MessageFromProcesser",
                            Run:data,
                            stage: 1 
                        })
                    }]
                })
            })


            await prisma.outBoxStapsRun.deleteMany({
                where: {
                    id: {
                        in: findOutboxRun.map((Data: any) => Data.id)
                    }
                }
            })
            await new Promise((resolve, reject) => setTimeout(resolve, 4000));
        }

    } catch (error) {

        return console.log("samthing want wrong")
    }
}

ProcessAllData();