import nodemailer, { type SentMessageInfo } from "nodemailer";
import { prisma } from "@myorg/database";

import { config } from "dotenv";
config();

export async function SendEmail(
  senderEmail: string,
  password: string,
  receiverEmail: string,
  message: string,
  warkflowId: number,
  index :number
): Promise<SentMessageInfo | Error> {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: senderEmail,
        pass: password,
      },
    });

    const info: SentMessageInfo = await transporter.sendMail({
      from: senderEmail,
      to: receiverEmail,
      subject: "n8n",
      text: "Hello world?",
      html: `<h2>${message}</h2>`,
    });

    const saveDataForEmailValidation = await prisma.sendEmailValidater.create({
      data: {
        workflowID: warkflowId,
        email :receiverEmail,
        messageID :info.messageId,
        index:index,
        status:"SUCCCESS"
      },
    });

    if(!saveDataForEmailValidation) return false;

    return true;
  } catch (error: any) {
    return false;
  }
}
