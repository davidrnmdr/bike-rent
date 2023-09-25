import sinon from "sinon";
import { App } from "./app";
import { Bike } from "./bike";
import { User } from "./user";
import { Location } from "./location";
import { BikeNotFoundError } from "./errors/bike-not-found-error";
import { UnavailableBikeError } from "./errors/unavailable-bike-error";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { DuplicateUserError } from "./errors/duplicate-user-error";
import { WrongCredentialError } from "./errors/wrong-credential-error";

describe("App", () => {
  it("should correctly calculate the rent amount", async () => {
    const app = new App();
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
    app.registerBike(bike);
    const clock = sinon.useFakeTimers();
    app.rentBike(bike.id, user.email);
    const hour = 1000 * 60 * 60;
    clock.tick(2 * hour);
    const rentAmount = app.returnBike(bike.id, user.email);
    expect(rentAmount).toEqual(200.0);
  });

  it("should be able to move a bike to a specific location", () => {
    const app = new App();
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
    app.registerBike(bike);
    const newYork = new Location(40.753056, -73.983056);
    app.moveBikeTo(bike.id, newYork);
    expect(bike.location.latitude).toEqual(newYork.latitude);
    expect(bike.location.longitude).toEqual(newYork.longitude);
  });

  it("should throw an exception when trying to move an unregistered bike", () => {
    const app = new App();
    const newYork = new Location(40.753056, -73.983056);
    expect(() => {
      app.moveBikeTo("fake-id", newYork);
    }).toThrow(BikeNotFoundError);
  });

  it("should correctly handle a bike rent", async () => {
    const app = new App();
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
    app.registerBike(bike);
    app.rentBike(bike.id, user.email);
    expect(app.rents.length).toEqual(1);
    expect(app.rents[0].bike.id).toEqual(bike.id);
    expect(app.rents[0].user.email).toEqual(user.email);
    expect(bike.available).toBeFalsy();
  });

  it("should throw unavailable bike when trying to rent an unavailable bike", async () => {
    const app = new App();
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
    app.registerBike(bike);
    app.rentBike(bike.id, user.email);
    expect(() => {
      app.rentBike(bike.id, user.email);
    }).toThrow(UnavailableBikeError);
  });

  it("should throw user not found error when user is not found", () => {
    const app = new App();
    expect(() => {
      app.findUser("fake@mail.com");
    }).toThrow(UserNotFoundError);
  });

  //tests for registerUser
  it("should throw duplicate user when trying to register an already registered user", async () => {
    const app = new App();
    const user = new User("david", "david@null.com", "123");
    await app.registerUser(user);
    expect(async () => {
      await app.registerUser(user);
    }).rejects.toMatchObject(new DuplicateUserError());
  });

  it("should match newly registered user data", async () => {
    const app = new App();
    const user = new User("david", "david@null.com", "123");
    await app.registerUser(user);
    expect(app.users[0].email).toEqual(user.email);
    expect(app.users[0].name).toEqual(user.name);
  });

  //test for authenticate
  it("should throw user not found (from findUser) when passing the wrong email", async () => {
    const app = new App();
    const user = new User("david", "david@null.com", "123");
    await app.registerUser(user);
    expect(async () => {
      await app.authenticate("aaron@null.com", "123");
    }).rejects.toMatchObject(new UserNotFoundError());
  });

  it("should return a falsy value when entering the wrong password", async () => {
    const app = new App();
    const user = new User("david", "david@null.com", "123");
    await app.registerUser(user);
    expect(await app.authenticate("david@null.com", "12")).toBeFalsy();
  });
});
