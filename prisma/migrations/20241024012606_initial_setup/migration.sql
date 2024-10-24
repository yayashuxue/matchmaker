/*
  Warnings:

  - You are about to drop the column `response1` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `response2` on the `Match` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[person1Token]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[person2Token]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - The required column `person1Token` was added to the `Match` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `person2Token` was added to the `Match` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `reason` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "response1",
DROP COLUMN "response2",
ADD COLUMN     "person1Response" TEXT,
ADD COLUMN     "person1Token" TEXT NOT NULL,
ADD COLUMN     "person2Response" TEXT,
ADD COLUMN     "person2Token" TEXT NOT NULL,
ALTER COLUMN "reason" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Match_person1Token_key" ON "Match"("person1Token");

-- CreateIndex
CREATE UNIQUE INDEX "Match_person2Token_key" ON "Match"("person2Token");
