import { PrismaBikeRepo } from "./external/database/prisma-bike-repo";
import { prisma } from "./external/database/prisma-client";
import { PrismaRentRepo } from "./external/database/prisma-rent-repo";
import { PrismaUserRepo } from "./external/database/prisma-user-repo";
import { App } from "./app";
import { Bike } from "./bike";
import { User } from "./user";

let userRepo = new PrismaUserRepo();
let bikeRepo = new PrismaBikeRepo();
let rentRepo = new PrismaRentRepo();

const app = new App(userRepo, bikeRepo, rentRepo);
const user = new User("Jose", "jose@mail.com", "1234");
const user2 = new User("david", "david@mail.com", "1234");
const bike = new Bike(
  "gto mountainbike",
  "mountain bike",
  1234,
  1234,
  100.0,
  "My bike",
  5,
  []
);
