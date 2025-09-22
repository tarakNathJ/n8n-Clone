/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `WorkFlow` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkFlow_name_key" ON "public"."WorkFlow"("name");
