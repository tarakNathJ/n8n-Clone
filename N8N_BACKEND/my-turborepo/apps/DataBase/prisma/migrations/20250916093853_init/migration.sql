/*
  Warnings:

  - You are about to drop the `OurBoxStapsRun` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."OurBoxStapsRun" DROP CONSTRAINT "OurBoxStapsRun_zapId_fkey";

-- DropTable
DROP TABLE "public"."OurBoxStapsRun";

-- CreateTable
CREATE TABLE "public"."OutBoxStapsRun" (
    "id" SERIAL NOT NULL,
    "StapsRunId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutBoxStapsRun_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."OutBoxStapsRun" ADD CONSTRAINT "OutBoxStapsRun_StapsRunId_fkey" FOREIGN KEY ("StapsRunId") REFERENCES "public"."StapsRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
