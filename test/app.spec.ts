import sinon from "sinon";
import { App } from "../src/app";
import { Bike } from "../src/bike";
import { User } from "../src/user";
import { Location } from "../src/location";
import { BikeNotFoundError } from "../src/errors/bike-not-found-error";
import { UnavailableBikeError } from "../src/errors/unavailable-bike-error";
import { UserNotFoundError } from "../src/errors/user-not-found-error";
import { DuplicateUserError } from "../src/errors/duplicate-user-error";
import { FakeUserRepo } from "./doubles/fake-user-repo";
import { FakeBikeRepo } from "./doubles/fake-bike-repo";
import { FakeRentRepo } from "./doubles/fake-rent-repo";
import { UserRepo } from "../src/ports/user-repo";
import { BikeRepo } from "../src/ports/bike-repo";
import { RentRepo } from "../src/ports/rent-repo";
import { UserWithOpenRentError } from "../src/errors/user-with-open-rent-error";
import { PrismaUserRepo } from "./prisma_repos/prisma-user-repo";
import { PrismaBikeRepo } from "./prisma_repos/prisma-bike-repo";
import { PrismaRentRepo } from "./prisma_repos/prisma-rent-repo";
import { prisma } from "../test/prisma_repos/prisma-client";

let userRepo: UserRepo = new PrismaUserRepo();
let bikeRepo: BikeRepo = new PrismaBikeRepo();
let rentRepo: RentRepo = new PrismaRentRepo();

describe("App", () => {
  beforeEach(async () => {
    await prisma.imgUrls.deleteMany();
    await prisma.rent.deleteMany();
    await prisma.user.deleteMany();
    await prisma.bike.deleteMany();
    await prisma.location.deleteMany();
  });

  it("should correctly calculate the rent amount", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    const user = new User("Jose", "jose@mail.com", "1234");
    await app.registerUser(user);
    const bike = new Bike(
      "caloi mountainbike",
      "mountain bike",
      1234,
      1234,
      100.0,
      "My bike",
      5,
      []
    );
    const bikeId = await app.registerBike(bike);
    const clock = sinon.useFakeTimers();
    await app.rentBike(bikeId, user.email);
    const hour = 1000 * 60 * 60;
    clock.tick(2 * hour);
    const rentAmount = await app.returnBike(bikeId, user.email);
    expect(rentAmount).toEqual(200.0);
  }, 50000);

  it("should be able to move a bike to a specific location", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    const bike = new Bike(
      "caloi mountainbike",
      "mountain bike",
      1234,
      1234,
      100.0,
      "My bike",
      5,
      []
    );
    const bikeId = await app.registerBike(bike);
    const newYork = new Location(40.753056, -73.983056);
    await app.moveBikeTo(bikeId, newYork);
    const bikeData = await app.findBike(bikeId);
    expect(bikeData.location.latitude).toEqual(newYork.latitude);
    expect(bikeData.location.longitude).toEqual(newYork.longitude);
  }, 50000);

  it("should throw an exception when trying to move an unregistered bike", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    const newYork = new Location(40.753056, -73.983056);
    await expect(app.moveBikeTo("fake-id", newYork)).rejects.toThrow(
      BikeNotFoundError
    );
  }, 50000);

  it("should correctly handle a bike rent", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    const user = new User("Jose", "jose@mail.com", "1234");
    const userId = await app.registerUser(user);
    const bike = new Bike(
      "caloi mountainbike",
      "mountain bike",
      1234,
      1234,
      100.0,
      "My bike",
      5,
      []
    );
    const bikeId = await app.registerBike(bike);
    const rentId = await app.rentBike(bikeId, user.email);
    const rentData = await prisma.rent.findUnique({ where: { id: rentId } });
    const bikeData = await prisma.bike.findUnique({ where: { id: bikeId } });

    expect(await prisma.rent.count()).toEqual(1);
    expect(rentData.bikeId).toEqual(bikeId);
    expect(rentData.userId).toEqual(userId);
    expect(bikeData.available).toBeFalsy();
  }, 50000);

  it("should throw unavailable bike when trying to rent with an unavailable bike", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    const user = new User("Jose", "jose@mail.com", "1234");
    await app.registerUser(user);
    const bike = new Bike(
      "caloi mountainbike",
      "mountain bike",
      1234,
      1234,
      100.0,
      "My bike",
      5,
      []
    );
    const bikeId = await app.registerBike(bike);
    await app.rentBike(bikeId, user.email);
    await expect(app.rentBike(bikeId, user.email)).rejects.toThrow(
      UnavailableBikeError
    );
  }, 50000);

  it("should throw user not found error when user is not found", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    await expect(app.findUser("fake@mail.com")).rejects.toThrow(
      UserNotFoundError
    );
  }, 50000);

  it("should correctly authenticate user", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    const user = new User("jose", "jose@mail.com", "1234");
    await app.registerUser(user);
    await expect(
      app.authenticate("jose@mail.com", "1234")
    ).resolves.toBeTruthy();
  }, 50000);

  it("should throw duplicate user error when trying to register a duplicate user", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    const user = new User("jose", "jose@mail.com", "1234");
    await app.registerUser(user);
    await expect(app.registerUser(user)).rejects.toThrow(DuplicateUserError);
  }, 50000);

  it("should correctly remove registered user", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    const user = new User("jose", "jose@mail.com", "1234");
    await app.registerUser(user);
    await app.removeUser(user.email);
    await expect(app.findUser(user.email)).rejects.toThrow(UserNotFoundError);
  }, 50000);

  it("should throw user not found error when trying to remove an unregistered user", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    await expect(app.removeUser("fake@mail.com")).rejects.toThrow(
      UserNotFoundError
    );
  }, 50000);

  it("should correctly register user", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    const user = new User("jose", "jose@mail.com", "1234");
    user.id = await app.registerUser(user);
    await expect(app.findUser(user.email)).resolves.toEqual(user);
  }, 50000);

  it("should throw user with open rent error when trying to remove an user with open rent(s)", async () => {
    const app = new App(userRepo, bikeRepo, rentRepo);
    const user = new User("Jose", "jose@mail.com", "1234");
    await app.registerUser(user);
    const bike = new Bike(
      "caloi mountainbike",
      "mountain bike",
      1234,
      1234,
      100.0,
      "My bike",
      5,
      []
    );
    const bikeId = await app.registerBike(bike);
    await app.rentBike(bikeId, user.email);
    expect(async () => {
      await app.removeUser(user.email);
    }).rejects.toMatchObject(new UserWithOpenRentError());
  }, 50000);
});
