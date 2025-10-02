/*
  Warnings:

  - You are about to drop the column `status` on the `StapsRun` table. All the data in the column will be lost.
  - Added the required column `status` to the `Staps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Staps" ADD COLUMN     "status" "StatusType" NOT NULL;

-- AlterTable
ALTER TABLE "StapsRun" DROP COLUMN "status";
