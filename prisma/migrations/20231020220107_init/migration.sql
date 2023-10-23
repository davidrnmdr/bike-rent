-- CreateTable
CREATE TABLE `Bike` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `bodySize` INTEGER NOT NULL,
    `maxLoad` DOUBLE NOT NULL,
    `rate` DOUBLE NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `ratings` INTEGER NOT NULL,
    `available` BOOLEAN NOT NULL DEFAULT true,
    `locationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImgUrls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `img0` VARCHAR(255) NOT NULL,
    `img1` VARCHAR(255) NOT NULL,
    `img2` VARCHAR(255) NOT NULL,
    `bikeId` INTEGER NOT NULL,

    UNIQUE INDEX `ImgUrls_bikeId_key`(`bikeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitude` DOUBLE NOT NULL DEFAULT 0.0,
    `longitude` DOUBLE NOT NULL DEFAULT 0.0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `bikeId` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,

    UNIQUE INDEX `Rent_userId_key`(`userId`),
    UNIQUE INDEX `Rent_bikeId_key`(`bikeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bike` ADD CONSTRAINT `Bike_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImgUrls` ADD CONSTRAINT `ImgUrls_bikeId_fkey` FOREIGN KEY (`bikeId`) REFERENCES `Bike`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rent` ADD CONSTRAINT `Rent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rent` ADD CONSTRAINT `Rent_bikeId_fkey` FOREIGN KEY (`bikeId`) REFERENCES `Bike`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
