/*
  Warnings:

  - Added the required column `status` to the `userReseveEmailData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userReseveEmailData" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "Workstatus" NOT NULL;
