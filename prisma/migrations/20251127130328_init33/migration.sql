-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'OTHER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('BEFORE', 'AFTER', 'OTHER');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('CONSULTATION', 'FOLLOW_UP', 'OTHER');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('PROSTHETICS', 'PHYSIOTHERAPY', 'FOOT_BALANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PROSTHETIC', 'ACCESSORY', 'OTHER');

-- CreateEnum
CREATE TYPE "DisplayType" AS ENUM ('TIMELINE', 'CAROUSEL', 'OTHER');

-- CreateEnum
CREATE TYPE "MilestoneType" AS ENUM ('BEFORE', 'AFTER', 'OTHER');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SponsorshipStatus" AS ENUM ('ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PartnershipType" AS ENUM ('MEDICAL', 'INVESTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CLOSED');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('NEW', 'REPLIED', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseRegistration" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "amputationType" TEXT NOT NULL,
    "amputationLevel" TEXT NOT NULL,
    "amputationDate" TIMESTAMP(3) NOT NULL,
    "currentCondition" TEXT NOT NULL,
    "previousProsthetics" BOOLEAN NOT NULL,
    "additionalNotes" TEXT,
    "status" "CaseStatus" NOT NULL,
    "priority" "Priority" NOT NULL,
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseImage" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageType" "ImageType" NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseNote" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "noteText" TEXT NOT NULL,
    "noteType" "NoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "appointmentType" "AppointmentType" NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "appointmentTime" TEXT NOT NULL,
    "assignedToId" TEXT,
    "status" "AppointmentStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceFeature" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceBenefit" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "benefitText" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceBenefit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceImage" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "parentCategoryId" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "description" TEXT NOT NULL,
    "specifications" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isPriceVisible" BOOLEAN NOT NULL DEFAULT true,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFeature" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "featureText" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuccessStory" (
    "id" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "caseType" TEXT NOT NULL,
    "storyTitle" TEXT NOT NULL,
    "storyDescription" TEXT NOT NULL,
    "beforeImage" TEXT NOT NULL,
    "afterImage" TEXT NOT NULL,
    "videoUrl" TEXT,
    "patientTestimonial" TEXT NOT NULL,
    "displayType" "DisplayType" NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuccessStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryMilestone" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "milestoneType" "MilestoneType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorshipCase" (
    "id" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "caseDescription" TEXT NOT NULL,
    "estimatedCost" DOUBLE PRECISION NOT NULL,
    "raisedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "caseImage" TEXT NOT NULL,
    "videoUrl" TEXT,
    "status" "SponsorshipStatus" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorshipCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorshipDonation" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT NOT NULL,
    "donorPhone" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SponsorshipDonation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL,
    "education" TEXT NOT NULL,
    "cvFileUrl" TEXT NOT NULL,
    "coverLetter" TEXT,
    "linkedinUrl" TEXT,
    "status" "JobStatus" NOT NULL,
    "reviewedById" TEXT,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnershipInquiry" (
    "id" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "partnershipType" "PartnershipType" NOT NULL,
    "country" TEXT NOT NULL,
    "inquiryDetails" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL,
    "assignedToId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnershipInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL,
    "repliedById" TEXT,
    "replyMessage" TEXT,
    "repliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogPostTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogPostTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_slug_key" ON "ProductCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogTag_slug_key" ON "BlogTag"("slug");

-- CreateIndex
CREATE INDEX "_BlogPostTags_B_index" ON "_BlogPostTags"("B");

-- AddForeignKey
ALTER TABLE "CaseRegistration" ADD CONSTRAINT "CaseRegistration_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseImage" ADD CONSTRAINT "CaseImage_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "CaseRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseNote" ADD CONSTRAINT "CaseNote_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "CaseRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseNote" ADD CONSTRAINT "CaseNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "CaseRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceFeature" ADD CONSTRAINT "ServiceFeature_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBenefit" ADD CONSTRAINT "ServiceBenefit_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceImage" ADD CONSTRAINT "ServiceImage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFeature" ADD CONSTRAINT "ProductFeature_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryMilestone" ADD CONSTRAINT "StoryMilestone_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "SuccessStory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorshipDonation" ADD CONSTRAINT "SponsorshipDonation_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "SponsorshipCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipInquiry" ADD CONSTRAINT "PartnershipInquiry_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_repliedById_fkey" FOREIGN KEY ("repliedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostTags" ADD CONSTRAINT "_BlogPostTags_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostTags" ADD CONSTRAINT "_BlogPostTags_B_fkey" FOREIGN KEY ("B") REFERENCES "BlogTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
