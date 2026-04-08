/*
  Warnings:

  - Made the column `productType` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "specifications" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "metaTitle" DROP NOT NULL,
ALTER COLUMN "metaDescription" DROP NOT NULL,
ALTER COLUMN "productType" SET NOT NULL;
