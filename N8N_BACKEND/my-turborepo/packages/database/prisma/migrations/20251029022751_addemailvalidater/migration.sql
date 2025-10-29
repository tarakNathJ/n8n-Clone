-- CreateEnum
CREATE TYPE "emailValidationStatus" AS ENUM ('SUCCCESS', 'PANDING', 'NEXTSTAGE', 'DONE');

-- CreateTable
CREATE TABLE "sendEmailValidater" (
    "id" SERIAL NOT NULL,
    "workflowID" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "messageID" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "status" "emailValidationStatus" NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sendEmailValidater_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sendEmailValidater_messageID_key" ON "sendEmailValidater"("messageID");
