import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import crypto from "crypto";

export class App {
  users: User[] = [];
  bikes: Bike[] = [];
  rents: Rent[] = [];

  //register bike
  registerBike(bike: Bike): void {
    bike.id = crypto.randomUUID();
    this.bikes.push(bike);
  }
  //remove user
  removeUser(user: User) {
    const email: string = user.email;
    const index: number = this.users.findIndex((user) => user.email === email);
    this.users.splice(index, 1);
  }
  //rent bike
  rentBike(bikeId: string, userEmail: string, startDate: Date, endDate: Date) {
    //recuperar bike
    const bike: Bike = this.findBike(bikeId);
    //recuperar o usuario
    const user: User = this.findUser(userEmail);
    //array somente com as reservas de bike
    const rents = this.rents.filter((rent) => rent.bike === bike);
    //tentar criar o rent com as infos da reserva
    const created: Rent = Rent.create(rents, bike, user, startDate, endDate);
    //adicionar a reserva ao array de reservas
    this.rents.push(created);
  }

  //return bike
  returnBike(bike: Bike, id: string) {
    //seleciona o aluguel desejado
    const rent: Rent = this.rents.filter(
      (rent) => rent.bike === bike && rent.id === id
    )[0];

    const today = new Date();

    rent.dateReturned = today;
  }

  findBike(bikeId: string) {
    return this.bikes.find((bike) => bike.id === bikeId);
  }

  registerUser(user: User): void {
    if (
      this.users.some((rUser) => {
        return rUser.email === user.email;
      })
    ) {
      throw new Error("Email already in use.");
    }
    user.id = crypto.randomUUID();
    this.users.push(user);
  }

  findUser(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  //listBikes
  listBikes(): Bike[] {
    return this.bikes;
  }

  //listUsers
  listUsers(): User[] {
    return this.users;
  }

  //listRents
  listRents(): Rent[] {
    return this.rents;
  }

  //authUser
  authUser(password: string): User | undefined {
    return this.users.find((user) => user.password === password);
  }
}
