import { Bike } from "../../bike";
import { Location } from "../../location";
import { BikeRepo } from "../../ports/bike-repo";
import crypto from "crypto";
import { prisma } from "./prisma-client";

export class PrismaBikeRepo implements BikeRepo {
  async find(id: string): Promise<Bike> {
    const bikeData = await prisma.bike.findUnique({ where: { id: id } });

    if (bikeData) {
      const locationData = await prisma.location.findUnique({
        where: { id: bikeData.locationId },
      });
      const location = new Location(
        locationData.latitude,
        locationData.longitude
      );

      return new Bike(
        bikeData.name,
        bikeData.type,
        bikeData.bodySize,
        bikeData.maxLoad,
        bikeData.rate,
        bikeData.description,
        bikeData.ratings,
        [],
        bikeData.available,
        location,
        bikeData.id
      );
    }
  }

  async add(bike: Bike): Promise<string> {
    const newId = crypto.randomUUID();
    let location = await prisma.location.findUnique({
      where: {
        latitude_longitude: {
          latitude: bike.location.latitude,
          longitude: bike.location.longitude,
        },
      },
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          latitude: bike.location.latitude,
          longitude: bike.location.longitude,
        },
      });
    }

    await prisma.bike.create({
      data: {
        id: newId,
        name: bike.name,
        type: bike.type,
        bodySize: bike.bodySize,
        maxLoad: bike.maxLoad,
        rate: bike.rate,
        description: bike.description,
        ratings: bike.ratings,
        imageUrls: [],
        available: true,
        location: {
          connect: {
            id: location.id,
          },
        },
        rents: {
          create: [],
        },
      },
    });
    return newId;
  }

  async update(id: string, bike: Bike): Promise<void> {
    let location = await prisma.location.findUnique({
      where: {
        latitude_longitude: {
          latitude: bike.location.latitude,
          longitude: bike.location.longitude,
        },
      },
    });
    if (!location) {
      location = await prisma.location.create({
        data: {
          latitude: bike.location.latitude,
          longitude: bike.location.longitude,
        },
      });
    }
    await prisma.bike.update({
      where: { id: id },
      data: {
        id: bike.id,
        name: bike.name,
        type: bike.type,
        bodySize: bike.bodySize,
        maxLoad: bike.maxLoad,
        rate: bike.rate,
        description: bike.description,
        ratings: bike.ratings,
        available: bike.available,
        location: {
          connect: {
            id: location.id,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<void> {
    await prisma.bike.delete({
      where: {
        id: id,
      },
    });
  }

  async list(): Promise<Bike[]> {
    const bikeList = await prisma.bike.findMany();
    let bikes;

    for (const [i, bike] of bikeList.entries()) {
      const locationData = await prisma.location.findUnique({
        where: { id: bike.locationId },
      });
      const location = new Location(
        locationData.latitude,
        locationData.longitude
      );

      const imageUrlsData = bike.imageUrls;
      bikes[i] = new Bike(
        bike.name,
        bike.type,
        bike.bodySize,
        bike.maxLoad,
        bike.rate,
        bike.description,
        bike.ratings,
        imageUrlsData,
        bike.available,
        location,
        bike.id
      );
    }
    return bikes;
  }
}