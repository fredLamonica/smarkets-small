export class Marca {
    public idMarca: number;
    public idTenant: number;
    public codigo: string;
    public nome: string;

    constructor(idMarca: number, idTenant: number, codigo: string, nome: string) {
        this.idMarca = idMarca;
        this.idTenant = idTenant;
        this.nome = nome;
        this.codigo = codigo;
    }
}