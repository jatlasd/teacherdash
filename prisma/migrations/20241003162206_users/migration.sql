/*
  Warnings:

  - Added the required column `ownerId` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToClass" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToClass_AB_unique" ON "_UserToClass"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToClass_B_index" ON "_UserToClass"("B");

-- AddForeignKey
ALTER TABLE "_UserToClass" ADD CONSTRAINT "_UserToClass_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToClass" ADD CONSTRAINT "_UserToClass_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
