/*
  Warnings:

  - The values [OTHER] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [OTHER] on the enum `ImageType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `noteType` on the `CaseNote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MALE', 'FEMALE');
ALTER TABLE "CaseRegistration" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "public"."Gender_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ImageType_new" AS ENUM ('BEFORE', 'AFTER');
ALTER TABLE "CaseImage" ALTER COLUMN "imageType" TYPE "ImageType_new" USING ("imageType"::text::"ImageType_new");
ALTER TYPE "ImageType" RENAME TO "ImageType_old";
ALTER TYPE "ImageType_new" RENAME TO "ImageType";
DROP TYPE "public"."ImageType_old";
COMMIT;

-- AlterTable
ALTER TABLE "CaseNote" DROP COLUMN "noteType",
ADD COLUMN     "noteType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "NoteType";
