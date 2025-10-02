/*
  Warnings:

  - Added the required column `typeOfWork` to the `Staps` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeOfWork" AS ENUM ('NORMAL', 'AUTOMATIC');

-- AlterTable
ALTER TABLE "Staps" ADD COLUMN     "typeOfWork" "TypeOfWork" NOT NULL;
