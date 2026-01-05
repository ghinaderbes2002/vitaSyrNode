/*
  Warnings:

  - You are about to drop the `BlogTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BlogPostTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlogPostTags" DROP CONSTRAINT "_BlogPostTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogPostTags" DROP CONSTRAINT "_BlogPostTags_B_fkey";

-- DropTable
DROP TABLE "BlogTag";

-- DropTable
DROP TABLE "_BlogPostTags";
