/*
  Warnings:

  - You are about to drop the `OurBoxZapRun` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTriger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Zap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZapRun` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `key` to the `AvaliableTriger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `AvliableAction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Type" AS ENUM ('ADMIN', 'MANAGER', 'DEVELOPER', 'HR');

-- DropForeignKey
ALTER TABLE "public"."OurBoxZapRun" DROP CONSTRAINT "OurBoxZapRun_zapId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserAction" DROP CONSTRAINT "UserAction_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserAction" DROP CONSTRAINT "UserAction_zapId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserTriger" DROP CONSTRAINT "UserTriger_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserTriger" DROP CONSTRAINT "UserTriger_zapId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Zap" DROP CONSTRAINT "Zap_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ZapRun" DROP CONSTRAINT "ZapRun_zapId_fkey";

-- AlterTable
ALTER TABLE "public"."AvaliableTriger" ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."AvliableAction" ADD COLUMN     "key" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."OurBoxZapRun";

-- DropTable
DROP TABLE "public"."UserAction";

-- DropTable
DROP TABLE "public"."UserTriger";

-- DropTable
DROP TABLE "public"."Zap";

-- DropTable
DROP TABLE "public"."ZapRun";

-- CreateTable
CREATE TABLE "public"."StapsRun" (
    "id" SERIAL NOT NULL,
    "zapId" INTEGER NOT NULL,
    "metaData" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StapsRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OurBoxStapsRun" (
    "id" SERIAL NOT NULL,
    "zaprunId" TEXT NOT NULL,
    "zapId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OurBoxStapsRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkFlow" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WorkFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Staps" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "index" INTEGER NOT NULL,
    "type" "public"."Type" NOT NULL,
    "app" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StapCondiction" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "stepsId" INTEGER NOT NULL,

    CONSTRAINT "StapCondiction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."StapsRun" ADD CONSTRAINT "StapsRun_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "public"."Staps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OurBoxStapsRun" ADD CONSTRAINT "OurBoxStapsRun_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "public"."Staps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkFlow" ADD CONSTRAINT "WorkFlow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Staps" ADD CONSTRAINT "Staps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StapCondiction" ADD CONSTRAINT "StapCondiction_stepsId_fkey" FOREIGN KEY ("stepsId") REFERENCES "public"."Staps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
