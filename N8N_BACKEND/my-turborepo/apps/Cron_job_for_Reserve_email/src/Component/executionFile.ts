import { prisma } from "@myorg/database";
import imaps, { ImapSimple, type Message } from "imap-simple";
import { Kafka, type Producer } from "kafkajs";



const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID|| "newKafka",
    brokers: [process.env.KAFKA_BROKERS_NAME||"localhost:9092"]
})

let producer: Producer;
// kafka producer instance provider
async function CreateProducer(): Promise<Producer> {
    if (producer) return producer;

    producer = kafka.producer();
    await producer.connect().catch((error) => console.log("producer connection failed", error.meassage));
    return producer;

}

interface EmailMessagePair {
  email: string;
  messageID: string;
}

interface ReplyResult {
  from: string;
  subject: string;
  messageID: string;
  reply: string;
}

type SendEmailValidationObject = {
  email: string;
  messageID: string;
};

type emailReplyObject = {
  from: string;
  subject: string;
  messageID: string;
  reply: string;
};

type Metadata = {
  EMAIL: String;
  PASSWORD: String;
};
type stapesObject = {
  workflowId: number;
  metadata: Metadata;
  createdAt: Date;
  index: number
};
// let reseiveEmailStapsArray: stapesObject[] = [];
// Utility: artificial delay
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function processExecutionMainFunction(): Promise<
  stapesObject[] | boolean
> {
  try {
    const pickAllReseiveEmailStapes: stapesObject[] | any =
      await prisma.staps.findMany({
        where: {
          name: "RESERVE_EMAIL_CHECKOUT",
        },
        select: {
          workflowId: true,
          metadata: true,
          createdAt: true,
          index: true,
        },
      });
    if (!pickAllReseiveEmailStapes || pickAllReseiveEmailStapes.length === 0)
      return false;
    return await pickAllReseiveEmailStapes;
  } catch (error) {
    return false;
  }
}

export async function fetchALlSendEmailValidator(
  reseiveEmailStapsArray: stapesObject[]
): Promise<boolean> {
  try {
    console.log("process start  ...");
    let count = 0;
    for (const data of reseiveEmailStapsArray) {
      console.log(
        "this is count : - ",
        count,
        "  ",
        reseiveEmailStapsArray.length
      );
      count++;
      let serchingDate = data.createdAt;
      console.log(serchingDate);
      //   find last submittion for ReseveEmailValidator
      const [lastSubmissionFromReseveEmailValidator] =
        await prisma.reseiveEmailValiDater.findMany({
          where: {
            workflowId: data.workflowId,
          },
          orderBy: {
            updateAt: "desc",
          },
          take: 1,
          select: {
            updateAt: true,
          },
        });

      // if no record exit then  use stapes date
      if (!lastSubmissionFromReseveEmailValidator) {
        console.log("No submissions found");
      } else {
        console.log(
          " submissions found",
          lastSubmissionFromReseveEmailValidator
        );
        serchingDate = lastSubmissionFromReseveEmailValidator.updateAt;
      }

      //   find All SendEmailValidationObject base on workflow id and time duration
      const findAllSendEmailValidationObjectFromDb:
        | SendEmailValidationObject
        | any = await prisma.sendEmailValidater.findMany({
        where: {
          workflowID: data.workflowId,
          createAt: {
            gte: serchingDate,
            lte: new Date(),
          },
        },
        select: {
          email: true,
          messageID: true,
        },
      });

      if (
        !findAllSendEmailValidationObjectFromDb ||
        findAllSendEmailValidationObjectFromDb.length === 0
      )
        continue;
      //   final work  ( fetch all message and send on kafka  js )
      const result = await waitForRepliesSince(
        serchingDate,
        findAllSendEmailValidationObjectFromDb,
        data.metadata
      );

      if (result.length != 0) {
        // update on reseive email validation
         const dataForValidationOfreseiveEmailValiDater =  await prisma.reseiveEmailValiDater.create({
          data: {
            workflowId: data.workflowId,
            status: "PANDING", // must match enum casing
            createAt: new Date(),
            updateAt: new Date(),
          },
        });

        const userReseverEmailData =   await prisma.userReseveEmailData.create({
          data:{
            reseiveEmailValiDaterId:dataForValidationOfreseiveEmailValiDater.id,
            UserData:result,
            status:"CREATE"
          }
        })
        const createObjectsendforKafka = {
          type: 'MessageFromWorker',
          UserMetaData : {
            reseverEmailDatas :userReseverEmailData.id,
            reseiveEmailValiDaterId :dataForValidationOfreseiveEmailValiDater.id

          }, 
          WorkFlowID:data.workflowId,
          stage:data.index+1

        }
        const producer = await CreateProducer();
        producer.send({
          topic : process.env.KAFKA_TOPIC || "TREAD_DATA",
          messages :[{
            value:JSON.stringify(createObjectsendforKafka)
          }]
        })


      }
    }
    console.log("save ");

    reseiveEmailStapsArray = [];
    // allEmailAndMessageIdArray = [];
    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
}

// 🧹 Clean helper (same as before)
function cleanEmailBody(raw: string): string {
  if (!raw) return "";

  let text = raw.replace(/=([A-Fa-f0-9]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  text = text.replace(/--[A-Za-z0-9\-=_]+/g, "");
  text = text.replace(/Content-[^\n]+\n?/gi, "");
  text = text.replace(/<\/?[^>]+(>|$)/g, "");

  const splitIndex = text.search(/On\s.*wrote:/i);
  if (splitIndex > -1) text = text.substring(0, splitIndex);

  return text.replace(/\r?\n+/g, "\n").trim();
}

/** --- Main Function: Wait for Replies Since Date --- */
async function waitForRepliesSince(
  sinceDate: Date,
  emailMessagePairs: EmailMessagePair[],
  metadata: Metadata
): Promise< emailReplyObject[] > {
  // IMAP Config
  try {
    console.log("Waiting 2 seconds before processing");
    delay(2000);
    const config = {
      imap: {
        user: metadata.EMAIL,
        password: metadata.PASSWORD,
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
      },
    };

    // @ts-ignore
    const connection: ImapSimple = await imaps.connect(config);
    await connection.openBox("INBOX");
    console.log("📬 Checking for replies since:", sinceDate);

    const searchCriteria = [["SINCE", sinceDate.toUTCString()]];
    const fetchOptions = { bodies: ["HEADER", "TEXT"], markSeen: false };

    const messages: Message[] = await connection.search(
      searchCriteria,
      fetchOptions
    );

    const results: ReplyResult[] = [];

    for (const msg of messages) {
      const headerPart = msg.parts.find((p) => p.which === "HEADER");
      const textPart = msg.parts.find((p) => p.which === "TEXT");

      if (!headerPart || !textPart) continue;

      const header = headerPart.body as any;
      const text = textPart.body as string;

      const from = header.from?.[0] || "";
      const subject = header.subject?.[0] || "(no subject)";
      const inReplyTo = header["in-reply-to"]?.[0] || "";
      const references = header.references?.[0] || "";

      for (const pair of emailMessagePairs) {
        if (
          from.toLowerCase().includes(pair.email.toLowerCase()) &&
          (inReplyTo.includes(pair.messageID) ||
            references.includes(pair.messageID))
        ) {
          const cleaned = cleanEmailBody(text);
          results.push({
            from,
            subject,
            messageID: pair.messageID,
            reply: cleaned,
          });
          break;
        }
      }
    }
    console.log("your result :  ", results);
    connection.end();
    console.log("connection end");

    return results;
  } catch (error) {
    console.log (error)
    return []
  }
}
