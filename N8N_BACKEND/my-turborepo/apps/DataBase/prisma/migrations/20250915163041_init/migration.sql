/*
  Warnings:

  - Added the required column `workflowId` to the `Staps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Staps" ADD COLUMN     "workflowId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Staps" ADD CONSTRAINT "Staps_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."WorkFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
