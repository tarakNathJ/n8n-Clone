/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `Staps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "AutoWorkerValidate" (
    "id" SERIAL NOT NULL,
    "Stapid" INTEGER NOT NULL,
    "curentTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutoWorkerValidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staps_index_key" ON "Staps"("index");

-- AddForeignKey
ALTER TABLE "AutoWorkerValidate" ADD CONSTRAINT "AutoWorkerValidate_Stapid_fkey" FOREIGN KEY ("Stapid") REFERENCES "Staps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
