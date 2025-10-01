-- CreateEnum
CREATE TYPE "public"."Type" AS ENUM ('TRIGGER', 'ACTION');

-- CreateTable
CREATE TABLE "public"."AvaliableTriger" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,

    CONSTRAINT "AvaliableTriger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AvliableAction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,

    CONSTRAINT "AvliableAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StapsRun" (
    "id" SERIAL NOT NULL,
    "metaData" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "WorkFlowId" INTEGER NOT NULL,

    CONSTRAINT "StapsRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OutBoxStapsRun" (
    "id" SERIAL NOT NULL,
    "StapsRunId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutBoxStapsRun_pkey" PRIMARY KEY ("id")
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
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workflowId" INTEGER NOT NULL,

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

-- CreateIndex
CREATE UNIQUE INDEX "AvaliableTriger_name_key" ON "public"."AvaliableTriger"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AvliableAction_name_key" ON "public"."AvliableAction"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WorkFlow_name_key" ON "public"."WorkFlow"("name");

-- AddForeignKey
ALTER TABLE "public"."StapsRun" ADD CONSTRAINT "StapsRun_WorkFlowId_fkey" FOREIGN KEY ("WorkFlowId") REFERENCES "public"."WorkFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OutBoxStapsRun" ADD CONSTRAINT "OutBoxStapsRun_StapsRunId_fkey" FOREIGN KEY ("StapsRunId") REFERENCES "public"."StapsRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkFlow" ADD CONSTRAINT "WorkFlow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Staps" ADD CONSTRAINT "Staps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Staps" ADD CONSTRAINT "Staps_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."WorkFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StapCondiction" ADD CONSTRAINT "StapCondiction_stepsId_fkey" FOREIGN KEY ("stepsId") REFERENCES "public"."Staps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
