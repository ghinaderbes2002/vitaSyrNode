/*
  Warnings:

  - You are about to drop the column `displayType` on the `SuccessStory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SuccessStory" DROP COLUMN "displayType";

-- DropEnum
DROP TYPE "DisplayType";
