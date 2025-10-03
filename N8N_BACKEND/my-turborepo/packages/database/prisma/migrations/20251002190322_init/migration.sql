/*
  Warnings:

  - The values [CREATE,PANDING,DONE,FAILED] on the enum `StatusType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `Workstatus` to the `StapsRun` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Workstatus" AS ENUM ('CREATE', 'PANDING', 'DONE', 'FAILED');

-- AlterEnum
BEGIN;
CREATE TYPE "StatusType_new" AS ENUM ('ACTIVE', 'DEACTIVE');
ALTER TABLE "Staps" ALTER COLUMN "status" TYPE "StatusType_new" USING ("status"::text::"StatusType_new");
ALTER TYPE "StatusType" RENAME TO "StatusType_old";
ALTER TYPE "StatusType_new" RENAME TO "StatusType";
DROP TYPE "public"."StatusType_old";
COMMIT;

-- AlterTable
ALTER TABLE "StapsRun" ADD COLUMN     "Workstatus" "Workstatus" NOT NULL;
