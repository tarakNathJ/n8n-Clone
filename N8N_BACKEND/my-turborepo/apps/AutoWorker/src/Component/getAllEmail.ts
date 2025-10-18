
import Imap from "node-imap";
import { simpleParser } from "mailparser";
import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

// ---------- AWS S3 Setup ----------
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Generate a pre-signed URL
async function generatePresignedUrl(bucketName: string, objectKey: string) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: "application/json",
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  console.log("Pre-Signed URL:", url);
  return url;
}

// Upload JSON file via pre-signed URL
async function uploadJsonFile(filePath: string, s3Key: string) {
  try {
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const presignedUrl = await generatePresignedUrl(
      process.env.BUCKET_NAME || "jsonBucket",
      s3Key
    );

    const response = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
    });

    if (response.ok) {
      console.log("✅ JSON file uploaded successfully!");
      return s3Key;
    } else {
      console.error("❌ Upload failed:", response.statusText);
    }
  } catch (err) {
    console.error("🚨 Error:", err);
  }
}

// ---------- Email Utilities ----------
function openInbox(imap: Imap, callback: (err: Error | null, box?: any) => void) {
  imap.openBox("INBOX", true, callback);
}

function filterCategory(email: { Subject?: string; From?: string; Body?: string }) {
  const subject = email.Subject || "";
  const from = email.From || "";
  const body = email.Body || "";

  if (
    /unsubscribe|sale|discount|offer|newsletter/i.test(subject + body) ||
    from.includes("mailchimp") ||
    from.includes("sendgrid") ||
    from.includes("promotions") ||
    from.includes("offers")
  ) {
    return "promotion";
  }

  return "personal";
}

// Save emails to JSON
export async function saveToJSON(data: any[]): Promise<string | undefined> {
  if (!data.length) return;

  const folder = "./emails";
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  const filename = `${Date.now()}_${Math.floor(Math.random() * 1000)}.json`;
  const fullPath = path.join(folder, filename);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf-8");

  return fullPath;
}



// ---------- Main Function ----------
export async function getAllEmailsAndStoreInfile(
userPassword: string, userEmail: string, time?: number | boolean): Promise<any[]> {
  const collectedEmails: {
    From: string;
    Subject: string;
    Body: string;
    Date: Date | undefined;
  }[] = [];

  return new Promise((resolve, reject) => {

    let addTime = 0;
    if(typeof time !== "boolean"){
      addTime = time || 0;
    }
    try {
      const imap = new Imap({
        user: userEmail,
        password: userPassword,
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        autotls: "always",
        tlsOptions: { servername: "imap.gmail.com" },
      });

      imap.once("ready", () => {
        openInbox(imap, (err) => {
          if (err) return reject(err);

          const sinceDate = new Date(Date.now() -  (24+addTime) * 60 * 60 * 1000);
          const imapDate = sinceDate
            .toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(",", "");

          console.log(`📅 Fetching emails since: ${imapDate}`);

          imap.search([["SINCE", imapDate]], (err, results) => {
            if (err) return reject(err);

            if (!results || !results.length) {
              console.log("📭 No new emails found in the last 24 hours.");
              imap.end();
              return resolve([]);
            }

            const fetcher = imap.fetch(results, { bodies: "" });

            fetcher.on("message", (msg) => {
              let buffer = "";

              msg.on("body", (stream) => {
                stream.on("data", (chunk) => (buffer += chunk.toString("utf8")));

                stream.on("end", async () => {
                  try {
                    const parsed = await simpleParser(buffer);
                    const emailData = {
                      From: parsed.from?.text || "",
                      Subject: parsed.subject || "",
                      Body: parsed.text || "",
                      Date: parsed.date,
                    };

                    if (filterCategory(emailData) === "personal") {
                      collectedEmails.push(emailData);
                    }
                  } catch (parseErr) {
                    console.error("⚠️ Error parsing email:", parseErr);
                  }
                });
              });
            });

            fetcher.once("end", async () => {
              console.log(
                `✅ Finished fetching. Personal emails: ${collectedEmails.length}`
              );


              imap.end();
              resolve(collectedEmails);
            });
          });
        });
      });

      imap.once("error", (err) => {
        console.error("⚠️ IMAP error:", err);
        reject(err);
      });

      imap.connect();
    } catch (error) {
      console.error("🚨 Error in getAllEmailsAndStoreInfile:", error);
      reject(error);
    }
  });
}
