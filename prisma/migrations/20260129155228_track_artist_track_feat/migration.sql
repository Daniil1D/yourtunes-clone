-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "audioUrl" TEXT;

-- CreateTable
CREATE TABLE "TrackArtist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "TrackArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackFeat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "TrackFeat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrackArtist" ADD CONSTRAINT "TrackArtist_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackFeat" ADD CONSTRAINT "TrackFeat_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
