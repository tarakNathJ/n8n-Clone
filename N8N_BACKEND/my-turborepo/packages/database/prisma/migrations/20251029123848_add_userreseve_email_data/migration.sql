-- CreateTable
CREATE TABLE "userReseveEmailData" (
    "id" SERIAL NOT NULL,
    "reseiveEmailValiDaterId" INTEGER NOT NULL,
    "UserData" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "userReseveEmailData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userReseveEmailData" ADD CONSTRAINT "userReseveEmailData_reseiveEmailValiDaterId_fkey" FOREIGN KEY ("reseiveEmailValiDaterId") REFERENCES "reseiveEmailValiDater"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
