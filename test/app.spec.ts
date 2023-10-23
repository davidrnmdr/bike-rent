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

let userRepo: UserRepo;
let bikeRepo: BikeRepo;
let rentRepo: RentRepo;

describe("App", () => {
  // beforeEach(() => {
  //   userRepo = new FakeUserRepo();
  //   bikeRepo = new FakeBikeRepo();
  //   rentRepo = new FakeRentRepo();
  // });

  it("should correctly calculate the rent amount", async () => {
    userRepo = new PrismaUserRepo();
    bikeRepo = new PrismaBikeRepo();
    rentRepo = new PrismaRentRepo();
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
    await app.removeUser(user.email);
    expect(rentAmount).toEqual(200.0);
  });
});
