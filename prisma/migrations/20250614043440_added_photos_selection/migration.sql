-- CreateTable
CREATE TABLE "PhotosSelection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photosList" TEXT NOT NULL,
    "totalPhotos" INTEGER NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isReady" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhotosSelection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_photosSelection_id_name_userId" ON "PhotosSelection"("id", "name", "userId");

-- AddForeignKey
ALTER TABLE "PhotosSelection" ADD CONSTRAINT "PhotosSelection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotosSelection" ADD CONSTRAINT "PhotosSelection_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
