-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'PHOTOGRAPHER', 'ADMIN');

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
    "bio" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "phone" TEXT NOT NULL,
    "phoneCode" TEXT,
    "phoneCodeSentAt" TIMESTAMP(3),
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerifiedAt" TIMESTAMP(3),
    "profileImageUrl" TEXT,
    "coverImageUrl" TEXT,
    "businessName" TEXT,
    "instagramUsername" TEXT,
    "facebookUsername" TEXT,
    "xUsername" TEXT,
    "websiteUrl" TEXT,
    "lastAccessAt" TIMESTAMP(3),
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
    "addressName" TEXT,
    "address" TEXT,
    "number" TEXT,
    "address2" TEXT,
    "neighborhood" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipCode" TEXT,
    "userId" TEXT NOT NULL,
    "accessHash" TEXT,
    "pricePerPhoto" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "relevanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "publishAt" TIMESTAMP(3),
    "unpublishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "display" BOOLEAN NOT NULL DEFAULT true,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "isWatermark" BOOLEAN NOT NULL DEFAULT true,
    "isOriginal" BOOLEAN NOT NULL DEFAULT false,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_user_id_email" ON "User"("id", "email");

-- CreateIndex
CREATE INDEX "idx_user_instagramUsername" ON "User"("instagramUsername");

-- CreateIndex
CREATE INDEX "idx_user_name" ON "User"("name");

-- CreateIndex
CREATE INDEX "idx_user_role" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Event_accessHash_key" ON "Event"("accessHash");

-- CreateIndex
CREATE INDEX "idx_event_id_title_date_userId" ON "Event"("id", "title", "date", "userId");

-- CreateIndex
CREATE INDEX "idx_event_city_state_country" ON "Event"("city", "state", "country");

-- CreateIndex
CREATE INDEX "idx_event_userId_date" ON "Event"("userId", "date");

-- CreateIndex
CREATE INDEX "idx_event_addressName" ON "Event"("addressName");

-- CreateIndex
CREATE INDEX "idx_event_isPublic" ON "Event"("isPublic");

-- CreateIndex
CREATE INDEX "idx_event_isFeatured" ON "Event"("isFeatured");

-- CreateIndex
CREATE INDEX "idx_event_isActive" ON "Event"("isActive");

-- CreateIndex
CREATE INDEX "idx_event_relevanceScore" ON "Event"("relevanceScore");

-- CreateIndex
CREATE INDEX "idx_photo_id_url_eventId" ON "Photo"("id", "url", "eventId");

-- CreateIndex
CREATE INDEX "idx_photo_isCover" ON "Photo"("isCover");

-- CreateIndex
CREATE INDEX "idx_photo_display" ON "Photo"("display");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
