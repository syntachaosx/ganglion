/*
  Warnings:

  - You are about to drop the column `tokens` on the `AuthToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `AuthToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthToken" DROP COLUMN "tokens",
ADD COLUMN     "token" VARCHAR(512) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");
