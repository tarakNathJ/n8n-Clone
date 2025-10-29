-- CreateTable
CREATE TABLE "reseiveEmailValiDater" (
    "id" SERIAL NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "creaat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reseiveEmailValiDater_pkey" PRIMARY KEY ("id")
);
