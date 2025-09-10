export class Banco {
    public idBanco: number;
    public descricao: string;
    public codigo: number;

    constructor(idBanco: number = 0, descricao: string = "", codigo: number = 0) {
        this.idBanco = idBanco;
        this.descricao = descricao;
        this.codigo = codigo;
    }
}