/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_userId_key" ON "Artist"("name", "userId");
