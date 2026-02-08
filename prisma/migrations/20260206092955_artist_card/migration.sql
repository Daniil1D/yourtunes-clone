-- CreateTable
CREATE TABLE "ArtistCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "spotifyUrl" TEXT,
    "appleMusicUrl" TEXT,
    "socialUrl" TEXT,
    "releaseId" TEXT NOT NULL,
    "ready" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtistCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtistCard_name_releaseId_key" ON "ArtistCard"("name", "releaseId");

-- AddForeignKey
ALTER TABLE "ArtistCard" ADD CONSTRAINT "ArtistCard_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;
