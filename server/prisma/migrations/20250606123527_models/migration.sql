/*
  Warnings:

  - You are about to drop the column `images` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "announcement" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "images";
