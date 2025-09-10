export class Autenticacao {
    public identificador: string;
    public senha: string;
    public idTenant: number;

    constructor(identificador: string, senha: string, idTenant: number) {
        this.identificador = identificador;
        this.senha = senha;
        this.idTenant = idTenant;
    }
}