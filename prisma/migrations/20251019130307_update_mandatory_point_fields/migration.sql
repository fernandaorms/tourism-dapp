/*
  Warnings:

  - Made the column `description` on table `Point` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoUrl` on table `Point` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `Point` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Point" DROP CONSTRAINT "Point_categoryId_fkey";

-- AlterTable
ALTER TABLE "Point" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "photoUrl" SET NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
