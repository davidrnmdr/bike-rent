import { Bike } from "../../src/bike";
import { Location } from "../../src/location";
import { BikeRepo } from "../../src/ports/bike-repo";
import crypto from "crypto";
import { prisma } from "./prisma-client";

export class PrismaBikeRepo implements BikeRepo {
  async find(id: string): Promise<Bike> {
    const bikeData = await prisma.bike.findUnique({ where: { id: id } });
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

  async add(bike: Bike): Promise<string> {
    const newId = crypto.randomUUID();
    (async function () {
      prisma.bike.create({
        data: {
          id: newId,
          name: bike.name,
          type: bike.type,
          bodySize: bike.bodySize,
          maxLoad: bike.maxLoad,
          rate: bike.rate,
          description: bike.description,
          ratings: bike.ratings,
          imageUrls: {
            create: {
              img0: bike.imageUrls[0],
              img1: bike.imageUrls[1],
              img2: bike.imageUrls[2],
            },
          },
          available: true,
          location: {
            create: {
              latitude: bike.location.latitude,
              longitude: bike.location.longitude,
            },
          },
          rents: {
            create: [],
          },
        },
      });
    })();
    return newId;
  }

  async update(id: string, bike: Bike): Promise<void> {
    (async function () {
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
          imageUrls: {
            create: {
              img0: bike.imageUrls[0],
              img1: bike.imageUrls[1],
              img2: bike.imageUrls[2],
            },
          },
          available: true,
          location: {
            create: {
              latitude: bike.location.latitude,
              longitude: bike.location.longitude,
            },
          },
        },
      });
    })();
  }

  async remove(id: string): Promise<void> {
    (async function () {
      prisma.bike.delete({
        where: {
          id: id,
        },
      });
    })();
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

      const imageUrlsData = await prisma.imgUrls.findUnique({
        where: { bikeId: bike.id },
      });
      const imageUrls = [
        imageUrlsData.img0,
        imageUrlsData.img1,
        imageUrlsData.img2,
      ];

      bikes[i] = new Bike(
        bike.name,
        bike.type,
        bike.bodySize,
        bike.maxLoad,
        bike.rate,
        bike.description,
        bike.ratings,
        imageUrls,
        bike.available,
        location,
        bike.id
      );
    }
    return bikes;
  }
}
