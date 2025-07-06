/*
  Warnings:

  - Added the required column `userId` to the `announcement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "announcement" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
