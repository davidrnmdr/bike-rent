export class Modelo { 
    constructor(
        public marca: string,
        public nome: string,
        public numPortas: number,
        public potencia: number,
        public combustivel: "alcool" | "gasolina" | "flex"
    ) {}
}