/*
  Warnings:

  - The values [ADMIN,MANAGER,DEVELOPER,HR] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Type_new" AS ENUM ('TRIGGER', 'ACTION');
ALTER TABLE "public"."Staps" ALTER COLUMN "type" TYPE "public"."Type_new" USING ("type"::text::"public"."Type_new");
ALTER TYPE "public"."Type" RENAME TO "Type_old";
ALTER TYPE "public"."Type_new" RENAME TO "Type";
DROP TYPE "public"."Type_old";
COMMIT;
