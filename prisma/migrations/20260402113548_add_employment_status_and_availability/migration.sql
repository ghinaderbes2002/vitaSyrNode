-- CreateEnum
CREATE TYPE "AvailabilityToJoin" AS ENUM ('IMMEDIATE', 'WITHIN_ONE_WEEK', 'WITHIN_TWO_WEEKS', 'WITHIN_ONE_MONTH');

-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "availabilityToJoin" "AvailabilityToJoin",
ADD COLUMN     "currentlyEmployed" BOOLEAN;
