/*
  Warnings:

  - The `serviceType` column on the `Service` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "serviceType",
ADD COLUMN     "serviceType" TEXT;

-- DropEnum
DROP TYPE "ServiceType";
