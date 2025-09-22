/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `AvliableAction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AvliableAction_name_key" ON "public"."AvliableAction"("name");
