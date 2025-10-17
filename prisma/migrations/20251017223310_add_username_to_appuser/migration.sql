/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `AppUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `AppUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppUser" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_username_key" ON "AppUser"("username");
