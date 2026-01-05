-- CreateEnum
CREATE TYPE "StoryType" AS ENUM ('MEDICAL', 'INSPIRATIONAL');

-- AlterTable
ALTER TABLE "StoryMilestone" ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SuccessStory" ADD COLUMN     "storyType" "StoryType" NOT NULL DEFAULT 'MEDICAL',
ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "caseType" DROP NOT NULL;
