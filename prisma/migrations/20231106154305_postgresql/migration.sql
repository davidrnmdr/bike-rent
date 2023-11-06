-- CreateTable
CREATE TABLE "Bike" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "bodySize" INTEGER NOT NULL,
    "maxLoad" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "ratings" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "Bike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImgUrls" (
    "id" SERIAL NOT NULL,
    "img0" VARCHAR(255),
    "img1" VARCHAR(255),
    "img2" VARCHAR(255),
    "bikeId" VARCHAR(255) NOT NULL,

    CONSTRAINT "ImgUrls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bikeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ImgUrls_bikeId_key" ON "ImgUrls"("bikeId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_latitude_longitude_key" ON "Location"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Rent_userId_key" ON "Rent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Rent_bikeId_key" ON "Rent"("bikeId");

-- AddForeignKey
ALTER TABLE "Bike" ADD CONSTRAINT "Bike_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImgUrls" ADD CONSTRAINT "ImgUrls_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
