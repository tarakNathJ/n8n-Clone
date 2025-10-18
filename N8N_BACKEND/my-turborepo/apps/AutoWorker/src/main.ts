



import { Consumer, Kafka } from "kafkajs";
import { config } from "dotenv";
import {
  getAllEmailsAndStoreInfile,
  saveToJSON,

} from "./Component/getAllEmail.js";

import { uploadFileOnAws}  from './Component/UploadFileInS3.js';
import {checkThisWorkUnder24Hours} from './Component/ChackThisWork.js'

config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID||"myKafka",
  brokers: [process.env.KAFKA_BROKERS_NAME||"localhost:9092"],
});

let consumer: Consumer | null = null;

async function createConsumer(GROUP_ID?: string): Promise<Consumer> {
  if (consumer) return consumer;
  consumer = kafka.consumer({ groupId: GROUP_ID || "AUTO_WORKER" });
  await consumer.connect();
  return consumer;
}

interface MessageFromProcesser {
  data: any;
  type: string;
  Run: {
    id: number;
    StapsRunId: number;
    createdAt: string;
    updatedAt: string;
  };
  stage: number;
}

// Utility: artificial delay
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function StartAutoWorkerFunction() {
  try {
    const consumerInstance = await createConsumer(process.env.GROUP_ID);

    await consumerInstance.subscribe({
      topic: process.env.TOPIC_NAME || "AUTO_TOPIC",
      fromBeginning: true,
    });

    console.log("🚀 Kafka consumer started and listening for messages...");

    await consumerInstance.run({
      autoCommit: true, // we'll manually commit after success
      eachMessage: async ({ topic, message, partition }) => {
        const rawMessage = message.value?.toString();
        if (!rawMessage) return;

        let data: MessageFromProcesser;
        let time :number | boolean ;
        try {
          data = JSON.parse(rawMessage);
          //@ts-ignore
           const status =  await checkThisWorkUnder24Hours(data?.data?.id);
           if (!status) return 
          //@ts-ignore
           time = status
        } catch (err) {
          console.error("❌ JSON parse failed:", err);
          return;
        }

        console.log("📩 Received Kafka message:", data);

        // Artificial delay before processing each message
        console.log("🕒 Waiting 5 seconds before processing...");
        await delay(5000);

        try {
          console.log("📨 Starting IMAP fetch for:", data?.data?.metadata?.EMAIL);
          const result = await getAllEmailsAndStoreInfile(
            data?.data?.metadata?.PASSWORD,
            data?.data?.metadata?.EMAIL,
            time
          );

          if (result && Array.isArray(result)) {

            if (result.length == 0) return 
            console.log(`✅ Processed ${result.length} emails for ${data?.data?.metadata?.EMAIL}`);
            const filePath = await saveToJSON(result);
            if (!filePath) return
            console.log("🗂️ Saved email file:", filePath);
            const UploadOnAwsS3 = await uploadFileOnAws(filePath,data.data.workflowId,data.data.id);
            console.log("data upload on aws s3" , UploadOnAwsS3)
          } else {
            console.warn("⚠️ No emails fetched or process failed.");
          }

          // Manual offset commit after successful processing
          await consumerInstance.commitOffsets([
            {
              topic,
              partition,
              offset: (parseInt(message.offset) + 1).toString(),
            },
          ]);

          console.log(`✅ Committed offset ${message.offset} for topic ${topic}`);

          // Delay again to prevent too frequent IMAP logins
          console.log("🕒 Cooling down for 10 seconds before next task...");
          await delay(10000);
        } catch (err) {
          console.error("🚨 Error during processing:", err);
        }
      },
    });
  } catch (error: any) {
    console.error("🔥 Kafka consumer error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

StartAutoWorkerFunction();
