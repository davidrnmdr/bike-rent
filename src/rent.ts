import { Bike } from "./bike";
import { User } from "./user";

export class Rent {
    private constructor(
        public bike: Bike,
        public user: User,
        public dateFrom: Date,
        public dateTo: Date,
        public dateReturned?: Date
    ) {}

    static create(rents: Rent[], bike: Bike, user: User,startDate: Date, endDate: Date): Rent {
        const canCreate = Rent.canRent(rents, startDate, endDate);
        if (canCreate) return new Rent(bike, user, startDate, endDate);
        throw new Error("Overlaping dates.");
    }    

    //so depende dos parametros, e nao de propriedades do objeto
    //entao foi feito um metodo estatico (poderia ser uma funcao)
    static canRent(rents: Rent[], startDate: Date, endDate: Date): boolean {
        //  return  !rents.some( rent => {startDate <= rent.dateTo && endDate >= rent.dateFrom})

         for (const rent of rents) {
            if(rents.some( rent => {startDate <= rent.dateTo && endDate >= rent.dateFrom})) {
                return false;
            }
         }
         return true;

    }
}
