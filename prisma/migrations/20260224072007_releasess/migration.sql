-- AlterEnum
ALTER TYPE "ReleaseStatus" ADD VALUE 'SCHEDULED';

-- DropIndex
DROP INDEX "Artist_name_userId_key";

-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "chartPosition" INTEGER,
ADD COLUMN     "playsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trending" BOOLEAN NOT NULL DEFAULT false;
