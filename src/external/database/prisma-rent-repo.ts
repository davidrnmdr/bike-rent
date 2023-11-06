import { RentRepo } from "../../ports/rent-repo";
import { Rent } from "../../rent";
import { User } from "../../user";
import { Bike } from "../../bike";
import { Location } from "../../location";
import crypto from "crypto";
import { prisma } from "./prisma-client";

export class PrismaRentRepo implements RentRepo {
  async add(rent: Rent): Promise<string> {
    const newId = crypto.randomUUID();

    await prisma.rent.create({
      data: {
        id: newId,
        userId: rent.user.id,
        bikeId: rent.bike.id,
        startDate: rent.start,
      },
    });

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

    const imageUrlsData = bikeData.imageUrls;
    const bike = new Bike(
      bikeData.name,
      bikeData.type,
      bikeData.bodySize,
      bikeData.maxLoad,
      bikeData.rate,
      bikeData.description,
      bikeData.ratings,
      imageUrlsData,
      bikeData.available,
      location,
      bikeData.id
    );
    const rentData = await prisma.rent.findFirst({
      where: { bikeId: bikeId, userId: user.id, endDate: null },
    });

    if (rentData) return new Rent(bike, user, rentData.startDate, rentData.id);
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

    let rents = [];

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
      const imageUrlsData = bikeData.imageUrls;
      const bike = new Bike(
        bikeData.name,
        bikeData.type,
        bikeData.bodySize,
        bikeData.maxLoad,
        bikeData.rate,
        bikeData.description,
        bikeData.ratings,
        imageUrlsData,
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

    await prisma.rent.update({
      where: { id: id },
      data: {
        id: rent.id,
        userId: rent.user.id,
        bikeId: rent.bike.id,
        startDate: rent.start,
        endDate: rent.end,
      },
    });
  }
}