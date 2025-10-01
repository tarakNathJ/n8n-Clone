import { Consumer, Kafka } from "kafkajs";
import { config } from "dotenv";
config();

const ConsumeInit = new Kafka({
  clientId: "myKafka",
  brokers: ["localhost:9092"],
});

let consumer: Consumer | null = null;

async function createComsumer(
  GROUP_ID?: string | undefined
): Promise<Consumer> {
  if (consumer) return consumer;

  consumer = ConsumeInit.consumer({ groupId: "autoWorker" });
  await consumer.connect();
  return consumer;
}

interface MessageFromProcesser {
  type: String;
  Run: {
    id: Number;
    StapsRunId: Number;
    createdAt: String;
    updatedAt: String;
  };
  stage: Number;
}

async function StartAutoWorkerFunction() {
  try {
    // get kafka consumer instance
    const getconsumerInstance = await createComsumer(
      process.env.GROUP_ID || "AUTO_WORKER"
    );
    //
    getconsumerInstance.subscribe({
      topic: process.env.TOPIC_NAME || "AUTO_TOPIC",
      fromBeginning: true,
    });

    getconsumerInstance.run({
      autoCommit: true,
      eachMessage: async ({ topic, message, partition }) => {
        

        let data: MessageFromProcesser ;
        try {
          data = JSON.parse(message.value?.toString() || "{}");
          console.log(data);
        } catch (err) {
          console.error(" JSON parse failed", err);
          return;
        }

        // Commit the current message offset manually
        getconsumerInstance.commitOffsets([
          {
            topic,
            partition,
            offset: (parseInt(message.offset) + 1).toString(),
          },
        ]);
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error on Kafka:", error.message);
      console.error(error.stack); // optional: full stack trace
    } else {
      console.error("Unknown error on Kafka:", error);
    }
    process.exit(1);
  }
}
StartAutoWorkerFunction();
