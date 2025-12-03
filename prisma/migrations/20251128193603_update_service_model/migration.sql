/*
  Warnings:

  - You are about to drop the column `fullDescription` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `mainImage` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "fullDescription",
DROP COLUMN "mainImage",
DROP COLUMN "shortDescription",
ADD COLUMN     "description" TEXT;
