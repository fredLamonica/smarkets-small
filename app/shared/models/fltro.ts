import { OperadorRelacional, OperadorLogico } from "./";

export class Filtro {
    public propriedade: string;
    public operadorRelacional: OperadorRelacional;
    public operadorLogico: OperadorLogico;
    public termo: string;

    constructor(propriedade: string, operadorRelacional: OperadorRelacional, operadorLogico: OperadorLogico, termo: string) {
        this.propriedade = propriedade;
        this.operadorRelacional = operadorRelacional;
        this.operadorLogico = operadorLogico;
        this.termo = termo;
    }
}