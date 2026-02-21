/*
  Warnings:

  - You are about to drop the column `visibility` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "visibility";

-- DropEnum
DROP TYPE "Visibility";
