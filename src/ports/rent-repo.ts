import { Rent } from "../rent";

export interface RentRepo {
  add(rent: Rent): Promise<string>;
  findOpen(bikeId: string, userEmail: string): Promise<Rent>;
  findOpenByUser(userEmail: string);
  update(id: string, rent: Rent): Promise<void>;
}
