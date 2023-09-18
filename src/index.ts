import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import sinon from "sinon";

async function main() {
  const clock = sinon.useFakeTimers();
  const app = new App();
  const user1 = new User("Jose", "jose@mail.com", "1234");
  await app.registerUser(user1);
  const bike = new Bike(
    "caloi 5",
    "mountain",
    21,
    100,
    200.0,
    "default model",
    4.3,
    [],
    true
  );
  app.registerBike(bike);
  console.log("Bike disponível: ", bike.available);
  app.rentBike(bike.id, user1.email);
  console.log("Bike disponível: ", bike.available);
  clock.tick(1000 * 60 * 65);
  console.log(app.returnBike(bike.id, user1.email));
  console.log("Bike disponível: ", bike.available);
}

main();
