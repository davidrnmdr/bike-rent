import { Bike } from "./bike";
import { Crypt } from "./crypt";
import { Rent } from "./rent";
import { User } from "./user";
import { Station } from "./station";
import crypto from "crypto";

export class App {
  users: User[] = [];
  bikes: Bike[] = [];
  rents: Rent[] = [];
  stations: Station[];
  crypt: Crypt = new Crypt();

  findUser(email: string): User {
    return this.users.find((user) => user.email === email);
  }

  async registerUser(user: User): Promise<string> {
    for (const rUser of this.users) {
      if (rUser.email === user.email) {
        throw new Error("Duplicate user.");
      }
    }
    const newId = crypto.randomUUID();
    user.id = newId;
    const encryptedPassword = await this.crypt.encrypt(user.password);
    user.password = encryptedPassword;
    this.users.push(user);
    return newId;
  }

  async authenticate(userEmail: string, password: string): Promise<boolean> {
    const user = this.findUser(userEmail);
    if (!user) throw new Error("User not found.");
    return await this.crypt.compare(password, user.password);
  }

  registerBike(bike: Bike): string {
    const newId = crypto.randomUUID();
    bike.id = newId;
    this.bikes.push(bike);
    return newId;
  }

  registerStation(station: Station, capacity: number, address: string): string {
    const newId = crypto.randomUUID();
    station.id = newId;
    station.capacity = capacity;
    station.address = address;
    this.stations.push(station);
    return newId;
  }

  removeUser(email: string): void {
    const userIndex = this.users.findIndex((user) => user.email === email);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return;
    }
    throw new Error("User does not exist.");
  }

  rentBike(bikeId: string, userEmail: string): void {
    const bike = this.bikes.find((bike) => bike.id === bikeId);
    if (!bike) {
      throw new Error("Bike not found.");
    }
    if (!bike.available) {
      throw new Error("Unavailable bike.");
    }
    const user = this.findUser(userEmail);
    if (!user) {
      throw new Error("User not found.");
    }
    bike.available = false;
    const newRent = new Rent(bike, user, new Date());
    this.rents.push(newRent);
  }

  returnBike(bikeId: string, userEmail: string, station: Station): number {
    const now = new Date();
    const rent = this.rents.find(
      (rent) =>
        rent.bike.id === bikeId && rent.user.email === userEmail && !rent.end
    );
    if (!rent) throw new Error("Rent not found.");
    rent.end = now;
    rent.bike.available = true;
    this.updateLocation(rent.bike, station);
    const hours = diffHours(rent.end, rent.start);
    return hours * rent.bike.rate;
  }

  updateLocation(bike: Bike, newStation: Station): void {
    bike.currentStation = this.stations.find(
      (station) => station.id === newStation.id
    );
  }

  listUsers(): User[] {
    return this.users;
  }

  listBikes(): Bike[] {
    return this.bikes;
  }

  listRents(): Rent[] {
    return this.rents;
  }
}

function diffHours(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(diff);
}
