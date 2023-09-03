import { Modelo } from "./modelo";
export class Carro {
    constructor(
        public placa: string,
        public modelo: Modelo,
        public cor: string
    ) {}
}

const ka = new Modelo("ford", "ka", 5, 2000, "gasolina");

