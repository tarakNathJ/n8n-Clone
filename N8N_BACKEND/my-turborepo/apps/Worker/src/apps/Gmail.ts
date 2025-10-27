import nodemailer, { type SentMessageInfo } from "nodemailer";

import { config } from "dotenv";
config();



export async function SendEmail(
  senderEmail: string,
  password: string,
  receiverEmail: string,
  message: string
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
    
    return true;
  } catch (error: any) {
    return false;
  }
}
