/*
  Warnings:

  - Added the required column `status` to the `StapsRun` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('CREATE', 'PANDING', 'DONE', 'FAILED');

-- AlterTable
ALTER TABLE "StapsRun" ADD COLUMN     "status" "StatusType" NOT NULL;
