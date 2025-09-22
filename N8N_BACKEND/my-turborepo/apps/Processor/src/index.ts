import { Kafka } from "kafkajs";
import { PrismaClient } from '../../DataBase/generated/prisma/index.js'

const prisma = new PrismaClient()

const kafka = new Kafka({
    clientId: "newKafka",
    brokers: ['localhost:9092']
})

const producer = kafka.producer();
await producer.connect().catch((error) => {
    console.log("kafka connection terminated")
})

async function ProcessAllData() {
    try {
        while (true) {
            console.log("data");
            const findOutboxRun = await prisma.OutBoxStapsRun.findMany({
                where: {},
                take: 5
            })

            console.log(findOutboxRun);

            findOutboxRun.map((data: { id: any }) => {
                producer.send({
                    topic: "TREAD_DATA",
                    messages: [{
                        value: JSON.stringify({
                            type: "MessageFromProcesser",
                            Run:data,
                            stage: 1 
                        })
                    }]
                })
            })


            await prisma.OutBoxStapsRun.deleteMany({
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