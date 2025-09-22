/*
  Warnings:

  - You are about to drop the column `zapId` on the `StapsRun` table. All the data in the column will be lost.
  - Added the required column `WorkFlowId` to the `StapsRun` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."StapsRun" DROP CONSTRAINT "StapsRun_zapId_fkey";

-- AlterTable
ALTER TABLE "public"."Staps" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."StapsRun" DROP COLUMN "zapId",
ADD COLUMN     "WorkFlowId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."StapsRun" ADD CONSTRAINT "StapsRun_WorkFlowId_fkey" FOREIGN KEY ("WorkFlowId") REFERENCES "public"."WorkFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
