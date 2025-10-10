import { config } from "dotenv";
import TelegramBot, { type ConstructorOptions } from "node-telegram-bot-api";
import type { Options as RequestOptions } from "request";
import { type AgentOptions } from "http";
import type { AwsCredentialIdentity } from "@aws-sdk/types";
import path from "path";
import {
  S3Client,
  
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import fs from "fs";
import axios from "axios";
config();

config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION  || "", // replace with your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } as AwsCredentialIdentity,
});

const getPreSignUrl = async (filename: string) => {
  try {
    // 2️⃣ Your file details (from your JSON)
    const bucketName = process.env.AWS_BACKET_NAME;
    const fileName = filename;

    // 3️⃣ Create a GetObjectCommand
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });
    const expiresInSeconds = 60 * 15;

    // 4️⃣ Generate a presigned URL (valid for 15 minutes)
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds,
    });
    // console.log("Presigned URL:", url);
    return url;
  } catch (error) {
    console.log("error ");
  }
};

async function downloadFile(fileName: string): Promise<string | boolean> {
  const url = await getPreSignUrl(fileName);
  // console.log(url);

  try {
    if (!url) return false;
    const response = await axios.get(url, {
      responseType: "json", // since your file is JSON
    });
    // Choose a local filename

    const folder = "./emails";
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    const filename = `${Date.now()}_${Math.floor(Math.random() * 1000)}.json`;
    const fuilPath = path.join(folder, filename);
    // console.log(response.data);
    // const filePath = "./downloaded.json";
    const jsonString = JSON.stringify(response.data, null, 2);

    // Write file
    // 👇 Write raw data as Buffer
    fs.writeFileSync(fuilPath, jsonString, "utf-8");

    console.log("✅ File downloaded:", fuilPath);
    return `./emails/${filename}`;
    // console.log("✅ File data:", response);
  } catch (err: any) {
    console.error("❌ Error downloading file:", err.message);
    return false;
  }
}

// downloadFile();

export async function sendMessageTelegram(
  token: string,
  chatId: string,
  message: object
): Promise<boolean> {
  try {
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN is not defined");
    }

    let Result = false;
    if ("FileName" in message) {
    } else {
      Result = await sendSimpleMessage(token, chatId, message);
    }

    return Result;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as any).response
    ) {
      console.error("Error from Telegram:", (error as any).response.body);
    } else if (error instanceof Error) {
      console.error("Network or other error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return false;
  }
}

// send simple message
async function sendSimpleMessage(
  token: string,
  chatId: string,
  message: object
): Promise<boolean> {
  try {
    const requestOptions: ConstructorOptions["request"] = {
      agentOptions: {
        family: 4, // Force IPv4
      } as AgentOptions,
    } as any;

    // Create bot instance
    const bot = new TelegramBot(token, {
      request: requestOptions,
    });

    // Await sending the message
    await bot.sendMessage(chatId, JSON.stringify(message));

    console.log("Message sent successfully!");
    return true;
  } catch (error) {
    console.log("error in send email");
    return false;
  }
}

// send file
async function sendFileinTelegramChatBot(
  token: string,
  chatId: string,
  message: object
): Promise<boolean> {
  try {
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN is not defined");
    }
    //@ts-ignore gget message

    const { message: caption } = message;
    // get data from aws s3
    //@ts-ignore
    const filePath = await downloadFile(message.FileName);
    if (!filePath || typeof filePath !== "string") {
      return false;
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const requestOptions: RequestOptions = {
      agentOptions: {
        family: 4, // Force IPv4
      },
    } as any;

    const bot = new TelegramBot(token, { request: requestOptions });

    const fileStream = fs.createReadStream(path.resolve(filePath));

    await bot.sendDocument(chatId, fileStream, {
      caption,
      // @ts-ignore
      contentType: "application/octet-stream", // avoid EFATAL AggregateError
    });

    fs.unlink(filePath, () => {
      console.log("file delete success fully");
    });
    console.log("✅ File sent successfully!");
    return true;
  } catch (error: any) {
    if (error?.response?.body) {
      console.error("Error from Telegram:", error.response.body);
    } else {
      console.error("Network or other error:", error.message);
    }
    return false;
  }
}
