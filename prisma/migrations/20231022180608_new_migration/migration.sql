/*
  Warnings:

  - The primary key for the `bike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `imgurls` DROP FOREIGN KEY `ImgUrls_bikeId_fkey`;

-- DropForeignKey
ALTER TABLE `rent` DROP FOREIGN KEY `Rent_bikeId_fkey`;

-- DropForeignKey
ALTER TABLE `rent` DROP FOREIGN KEY `Rent_userId_fkey`;

-- AlterTable
ALTER TABLE `bike` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `imgurls` MODIFY `bikeId` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `rent` MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `bikeId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `ImgUrls` ADD CONSTRAINT `ImgUrls_bikeId_fkey` FOREIGN KEY (`bikeId`) REFERENCES `Bike`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rent` ADD CONSTRAINT `Rent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rent` ADD CONSTRAINT `Rent_bikeId_fkey` FOREIGN KEY (`bikeId`) REFERENCES `Bike`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
