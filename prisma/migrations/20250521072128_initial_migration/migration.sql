-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'PHOTOGRAPHER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailCode" TEXT,
    "emailCodeSentAt" TIMESTAMP(3),
    "emailVerifiedAt" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "passwordCode" TEXT,
    "passwordCodeSentAt" TIMESTAMP(3),
    "passwordResetAt" TIMESTAMP(3),
    "type" "UserType" NOT NULL DEFAULT 'CUSTOMER',
    "phone" TEXT,
    "phoneCode" TEXT,
    "phoneCodeSentAt" TIMESTAMP(3),
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerifiedAt" TIMESTAMP(3),
    "locationId" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessHash" TEXT NOT NULL,
    "pricePerPhoto" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "coverPhotoUrl" TEXT,
    "displayCoverPhotoUrl" BOOLEAN NOT NULL DEFAULT false,
    "displayUser" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "number" TEXT,
    "address2" TEXT,
    "neighborhood" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "displayTitle" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "displayDescription" BOOLEAN NOT NULL DEFAULT false,
    "displayCoverPhotoUrl" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "eventId" TEXT NOT NULL,
    "coverPhotoId" TEXT,
    "accessHash" TEXT NOT NULL,
    "pricePerPhoto" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "display" BOOLEAN NOT NULL DEFAULT true,
    "isWatermark" BOOLEAN NOT NULL DEFAULT true,
    "isOriginal" BOOLEAN NOT NULL DEFAULT false,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_user_id_email" ON "User"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_accessHash_key" ON "Event"("accessHash");

-- CreateIndex
CREATE INDEX "idx_event_id_title_date_locationId_userId" ON "Event"("id", "title", "date", "locationId", "userId");

-- CreateIndex
CREATE INDEX "idx_location_id_name_latitude_longitude" ON "Location"("id", "name", "latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Album_accessHash_key" ON "Album"("accessHash");

-- CreateIndex
CREATE INDEX "idx_album_id_title_eventId" ON "Album"("id", "title", "eventId");

-- CreateIndex
CREATE INDEX "idx_photo_id_url_albumId" ON "Photo"("id", "url", "albumId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
