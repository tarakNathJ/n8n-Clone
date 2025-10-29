/*
  Warnings:

  - You are about to drop the column `creaat` on the `reseiveEmailValiDater` table. All the data in the column will be lost.
  - Added the required column `createAt` to the `reseiveEmailValiDater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `reseiveEmailValiDater` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reseiveEmailValiDater" DROP COLUMN "creaat",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "Workstatus" NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
