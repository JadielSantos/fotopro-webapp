-- AlterTable
ALTER TABLE "PhotosSelection" ALTER COLUMN "isReady" SET DEFAULT true;

-- CreateIndex
CREATE INDEX "idx_photosSelection_eventId" ON "PhotosSelection"("eventId");

-- CreateIndex
CREATE INDEX "idx_photosSelection_userId" ON "PhotosSelection"("userId");
