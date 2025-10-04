import cron from "node-cron";
import { Kafka, type Producer } from "kafkajs";
import { prisma} from "@myorg/database";
import { config } from "dotenv";
config();

let producer: Producer | null = null;

const kafka = new Kafka({
  clientId: "myKafka",
  brokers: ["localhost:9092"],
});

async function initializeProducer(): Promise<Producer> {
  if (producer) return producer;
  producer = kafka.producer();
  await producer.connect();
  return producer;
}


// Run every 10 minutes, all day long
const task = cron.schedule(
  "* * * * *",
  async () => {
    await checkAutoWorker();
    console.log("call connect");
  },
  { scheduled: false } as any
);

async function checkAutoWorker(): Promise<boolean> {
  try {
    // Stop to prevent overlapping jobs
    task.stop();
    console.log("calling")

    const connectProducer = await initializeProducer().catch((error) => {
      console.error("❌ Producer connection failed:", error.message);
      return null;
    });

    if (!connectProducer) {
      task.start();
      return false;
    }

    const findAutoWorker = await prisma.Staps.findMany({
      where: {
        type: "TRIGGER", // ✅ enum instead of raw string
        typeOfWork: "AUTOMATIC",
        status: "ACTIVE"
        
      },
    });

    console.log(findAutoWorker);

    for (const data of findAutoWorker) {
      await connectProducer.send({
        topic: process.env.KAFKA_TOPIC || "AUTO",
        messages: [
          {
            value: JSON.stringify({
              type: "MessageFromCroneJob",
              data,
            }),
          },
        ],
      });
    }

    // Restart cron after completion
    task.start();
    return true;
  } catch (error: any) {
    console.error("❌ Error in checkAutoWorker:", error.message);
    task.destroy();
    return false;
  }
}

task.start();
