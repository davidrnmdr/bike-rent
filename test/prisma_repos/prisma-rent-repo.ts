import { RentRepo } from "../../src/ports/rent-repo";
import { Rent } from "../../src/rent";
import { User } from "../../src/user";
import { Bike } from "../../src/bike";
import { Location } from "../../src/location";
import crypto from "crypto";
import { prisma } from "./prisma-client";

export class PrismaRentRepo implements RentRepo {
  async add(rent: Rent): Promise<string> {
    const newId = crypto.randomUUID();
    (async function () {
      prisma.rent.create({
        data: {
          id: newId,
          userId: rent.user.id,
          bikeId: rent.bike.id,
          startDate: rent.start,
        },
      });
    })();
    return newId;
  }

  async findOpen(bikeId: string, userEmail: string): Promise<Rent> {
    const userData = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    const user = new User(
      userData.name,
      userData.email,
      userData.password,
      userData.id
    );

    const bikeData = await prisma.bike.findUnique({ where: { id: bikeId } });
    const locationData = await prisma.location.findUnique({
      where: { id: bikeData.locationId },
    });
    const location = new Location(
      locationData.latitude,
      locationData.longitude
    );

    const imageUrlsData = await prisma.imgUrls.findUnique({
      where: { bikeId: bikeData.id },
    });
    const imageUrls = [
      imageUrlsData.img0,
      imageUrlsData.img1,
      imageUrlsData.img2,
    ];
    const bike = new Bike(
      bikeData.name,
      bikeData.type,
      bikeData.bodySize,
      bikeData.maxLoad,
      bikeData.rate,
      bikeData.description,
      bikeData.ratings,
      imageUrls,
      bikeData.available,
      location,
      bikeData.id
    );
    const rentData = await prisma.rent.findUnique({
      where: { bikeId: bikeId, userId: user.id, endDate: null },
    });

    return new Rent(bike, user, rentData.startDate, rentData.id);
  }

  async findOpenByUser(userEmail: string): Promise<Rent[]> {
    const userData = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    const user = new User(
      userData.name,
      userData.email,
      userData.password,
      userData.id
    );
    const rentList = await prisma.rent.findMany({
      where: { userId: userData.id, endDate: null },
    });

    let rents;

    for (const [i, rent] of rentList.entries()) {
      const bikeData = await prisma.bike.findUnique({
        where: { id: rent.bikeId },
      });
      const locationData = await prisma.location.findUnique({
        where: { id: bikeData.locationId },
      });
      const location = new Location(
        locationData.latitude,
        locationData.longitude
      );
      const imageUrlsData = await prisma.imgUrls.findUnique({
        where: { bikeId: bikeData.id },
      });
      const imageUrls = [
        imageUrlsData.img0,
        imageUrlsData.img1,
        imageUrlsData.img2,
      ];
      const bike = new Bike(
        bikeData.name,
        bikeData.type,
        bikeData.bodySize,
        bikeData.maxLoad,
        bikeData.rate,
        bikeData.description,
        bikeData.ratings,
        imageUrls,
        bikeData.available,
        location,
        bikeData.id
      );
      rents[i] = new Rent(bike, user, rent.startDate, rent.id);
    }
    return rents;
  }
  async update(id: string, rent: Rent): Promise<void> {
    const locationData = await prisma.location.findUnique({
      where: {
        latitude_longitude: {
          latitude: rent.bike.location.latitude,
          longitude: rent.bike.location.longitude,
        },
      },
    });
    const bikeRentList = await prisma.rent.findMany({
      where: { bikeId: rent.bike.id },
    });
    (async function () {
      prisma.rent.update({
        where: { id: id },
        data: {
          id: rent.id,
          userId: rent.user.id,
          bikeId: rent.bike.id,
          startDate: rent.start,
        },
      });
    })();
  }
}
