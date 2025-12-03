-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_caseId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "caseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "CaseRegistration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
