import {
  S3Client,
  PutObjectAclCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Config } from "node-imap";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import fs from "fs";
import axios from "axios";
import { prisma } from "@myorg/database";
import { config } from "dotenv";


config();
const s3Client = new S3Client({
  region: process.env.AWS_REGION || " ",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } as AwsCredentialIdentity,
});

async function generatePreSignURL(imageUrl: String) {
  try {
    const bucketName = process.env.AWS_BACKET_NAME;
    if (!imageUrl) return;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      //@ts-ignore
      Key: imageUrl,
      ContentType: "application/json",
    });

    const signURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log("generate presign url generate is success fully");
    return signURL;
  } catch (error: any) {
    console.log("samthing is wrong to generate ppresign url");
    return null;
  }
}

async function UpdateOnDataBase(FileName: String, WorkFlowId: Number , StapsId:Number) :Promise <boolean> {
  const savedata = await prisma.StapsRun.create({
    data: {
      metaData: {
        FileName: FileName,
        message: "your all emails",
      },
      Workstatus: "CREATE",
      createdAt: new Date(),
      WorkFlowId: WorkFlowId,
    },
  });
   const saveAutoWork =  await prisma.AutoWorkerValidate.create({
      data:{
        Stapid:StapsId,
        curentTime: new Date()
      }
    });

  const addRecord = await prisma.OutBoxStapsRun.create({
    data: {
      StapsRunId: savedata.id,

      createdAt: new Date(),
    },
  });

  return true;
}

export async function uploadFileOnAws(
  FileName: string,
  WorkFlowId: Number,
  StapsId: Number
): Promise<boolean> {
  const filePath = `./emails/${FileName}`;

  // Check if file exists
  if (!fs.existsSync(FileName)) return false;

  // Generate presigned URL (you must define this function elsewhere)
  const presignUrl = await generatePreSignURL(FileName);
  if (!presignUrl) return false;

  const fileData = fs.readFileSync(filePath);

  // Upload file using presigned URL
  const response = await axios.put(presignUrl, fileData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
   console.log("file upload success fully");
  const responce : boolean =  await UpdateOnDataBase (FileName,WorkFlowId ,StapsId);
  
  return responce;
}
