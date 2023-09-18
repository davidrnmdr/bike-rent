import { Bike } from "./bike";

export class Station {
  constructor(
    public id: string,
    public bikes: Bike[],
    public capacity: number,
    public address: string
  ) {}
}
