// import Imap from "node-imap";
// import { simpleParser } from "mailparser";
// import fs from "fs";
// import path from "path";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import dotenv from "dotenv";
// dotenv.config();


// type s3CreateClientObject = {
//   region:String,
//   credentials:{
//     accessKeyId:string,
//     secretAccessKey:string

//   }
// }

// // @ts-ignore
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION  ,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// }) ;


// // get  pre sign url
// async function generatePresignedUrl( bucketName :string  ,objectKey :string) {
//     // const bucketName = "your-bucket-name";
//     // const objectKey = "example.json"; // file name in S3

//     const command = new PutObjectCommand({
//         Bucket: bucketName,
//         Key: objectKey,
//         ContentType: "application/json",
//     });

//     // Generate URL valid for 60 seconds
//     const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
//     console.log("Pre-Signed URL:", url);
//     return url;
// }




// // upload file
// async function uploadJsonFile(filePath :string, s3Key :string) {
//     try {
//         // Read JSON file from disk
//         const jsonData = fs.readFileSync(filePath, "utf-8");

//         // Generate pre-signed URL
//         const presignedUrl = await generatePresignedUrl(process.env.bucketName || "jsonBacket" ,s3Key);

//         // Upload file using pre-signed URL
//         const response = await fetch(presignedUrl, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: jsonData, // send JSON as string
//         });

//         if (response.ok) {
//             console.log("JSON file uploaded successfully!");
//             return s3Key;
//         } else {
//             console.error("Upload failed:", response.statusText);
//         }
//     } catch (err) {
//         console.error("Error:", err);
//     }
// }




// // const filePath = "./data.json"; // path to your local JSON file
// // const s3Key = "uploaded-data.json"; // S3 object key
// // uploadJsonFile(filePath, s3Key);







// function openInbox(imap :any, callback :any ) {
//   imap.openBox("INBOX", true, callback);
// }

// function filterCategory(email :any) {
//   const subject = email.subject || "";
//   const from = email.from || "";
//   const body = email.body || "";

//   // Detect promotional messages
//   if (
//     /unsubscribe|sale|discount|offer|newsletter/i.test(subject + body) ||
//     from.includes("mailchimp") ||
//     from.includes("sendgrid") ||
//     from.includes("promotions") ||
//     from.includes("offers")
//   ) {
//     return "promotion";
//   }

//   return "personal";
// }



// export async function saveToJSON(data :Array<any>) :Promise<string | undefined> {
//   if (!data.length) return "";

//   const folder = "./emails";
//   if (!fs.existsSync(folder)) fs.mkdirSync(folder);
//   const filenames = `${new Date().getTime() + Math.floor(Math.random() * 1000)}.json` ;
//   const filename = path.join(folder, filenames);
//   fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");

//   return `./emails/${filenames}`;
// }

// type objectsType = {
//     From :string,
//     Subject:string,
//     Body:string,
//     Date:Date | undefined;


// }

// // Main function to fetch and process emails
// export async function getAllEmailsAndStoreInfile(userPassword :string, userEmail:string) {
//   const collectedEmails: objectsType[] = [];

//   try {
//     const imap = new Imap({
//       user: userEmail,
//       password: userPassword,
//       host: "imap.gmail.com",
//       port: 993,
//       tls: true,
//       autotls: "always",
//       tlsOptions: { servername: "imap.gmail.com" },
//     });

//     // When IMAP is ready
//     imap.once("ready", () => {
//       openInbox(imap, (err :Error) => {
//         if (err) throw err;

//         // Fetch emails from the last 24 hours
//         const sinceDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
//         const imapDate = sinceDate
//           .toLocaleDateString("en-US", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           })
//           .replace(",", "");

//         console.log(`📅 Fetching emails since: ${imapDate}`);

//         imap.search([["SINCE", imapDate]], (err, results) => {
//           if (err) {
//             console.error("❌ Search error:", err);
//             return;
//           }

//           if (!results || !results.length) {
//             console.log("📭 No new emails found in the last 24 hours.");
//             imap.end();
//             return;
//           }

//           const fetcher = imap.fetch(results, { bodies: "" });

//           fetcher.on("message", (msg) => {
//             let buffer = "";

//             msg.on("body", (stream) => {
//               stream.on("data", (chunk) => {
//                 buffer += chunk.toString("utf8");
//               });

//               stream.on("end", async () => {
//                 try {
//                   const parsed = await simpleParser(buffer);

//                   const emailData = {
//                     From: parsed.from?.text || "",
//                     Subject: parsed.subject || "",
//                     Body: parsed.text || "",
//                     Date: parsed.date,
//                   };

//                   if (filterCategory(emailData) === "personal") {
                    
//                     collectedEmails.push(emailData);
//                   }
//                 } catch (parseErr) {
//                   console.error("⚠️ Error parsing email:", parseErr);
//                 }
//               });
//             });
//           });

//           fetcher.once("end", () => {
//             console.log(
//               `✅ Finished fetching emails. Total personal emails: ${collectedEmails.length}`
//             );
//             imap.end();
//           });
//         });
//       });
//     });

//     // IMAP error handlers
//     imap.once("error", (err) => console.error("⚠️ IMAP error:", err));
//     imap.once("end", async() =>{
//       //  const filepath = await saveToJSON(collectedEmails);
//       //  console.log( "this is your file path : - ",filepath);
//       //  if (!filepath) return console.log("file not exit")
//         // await uploadJsonFile(filepath ,userEmail+ new Date())
//         console.log("🧾 IMAP connection closed.");
//         return collectedEmails
//       });
      
//     // Connect
//     imap.connect();

    
      
//   } catch (error) {
//     console.error("🚨 Error in getAllEmailsAndStoreInfile:", error);
//     return false;
//   }
// }









// // Example test run (uncomment and add credentials)
// // getAllEmailsAndStoreInfile("your_app_password", "your_email@gmail.com");


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

getAllEmailsAndStoreInfile

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

              // const filePath = await saveToJSON(collectedEmails);
              // if (filePath) {
              //   const key = `${userEmail}_${Date.now()}.json`;
              //   await uploadJsonFile(filePath, key);
              // }

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
