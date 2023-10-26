import { PrismaBikeRepo } from "../test/prisma_repos/prisma-bike-repo";
import { prisma } from "../test/prisma_repos/prisma-client";
import { PrismaRentRepo } from "../test/prisma_repos/prisma-rent-repo";
import { PrismaUserRepo } from "../test/prisma_repos/prisma-user-repo";
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
