/*
  Warnings:

  - Added the required column `managerId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "managerId" TEXT NOT NULL,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC';

-- CreateTable
CREATE TABLE "_ProjectMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectMembers_B_index" ON "_ProjectMembers"("B");

-- CreateIndex
CREATE INDEX "Project_managerId_idx" ON "Project"("managerId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectMembers" ADD CONSTRAINT "_ProjectMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectMembers" ADD CONSTRAINT "_ProjectMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
