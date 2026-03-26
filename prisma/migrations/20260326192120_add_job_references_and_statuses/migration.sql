/*
  Warnings:

  - The values [REVIEWED] on the enum `JobStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `ref1Company` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ref1JobTitle` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ref1Name` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ref1Phone` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ref2Company` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ref2JobTitle` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ref2Name` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ref2Phone` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JobStatus_new" AS ENUM ('PENDING', 'INTERVIEW_READY', 'ACCEPTED', 'REJECTED', 'HIRED');
ALTER TABLE "JobApplication" ALTER COLUMN "status" TYPE "JobStatus_new" USING ("status"::text::"JobStatus_new");
ALTER TYPE "JobStatus" RENAME TO "JobStatus_old";
ALTER TYPE "JobStatus_new" RENAME TO "JobStatus";
DROP TYPE "public"."JobStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "ref1Company" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ref1JobTitle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ref1Name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ref1Phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ref2Company" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ref2JobTitle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ref2Name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ref2Phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "rejectionNote" TEXT;

ALTER TABLE "JobApplication" ALTER COLUMN "ref1Company" DROP DEFAULT;
ALTER TABLE "JobApplication" ALTER COLUMN "ref1JobTitle" DROP DEFAULT;
ALTER TABLE "JobApplication" ALTER COLUMN "ref1Name" DROP DEFAULT;
ALTER TABLE "JobApplication" ALTER COLUMN "ref1Phone" DROP DEFAULT;
ALTER TABLE "JobApplication" ALTER COLUMN "ref2Company" DROP DEFAULT;
ALTER TABLE "JobApplication" ALTER COLUMN "ref2JobTitle" DROP DEFAULT;
ALTER TABLE "JobApplication" ALTER COLUMN "ref2Name" DROP DEFAULT;
ALTER TABLE "JobApplication" ALTER COLUMN "ref2Phone" DROP DEFAULT;
