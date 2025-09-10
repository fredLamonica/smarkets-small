import { TipoPessoa } from "./enums/tipo-pessoa";
import { Tenant } from "./tenant";

export class Pessoa {
    public idPessoa: number;
    public codigoPessoa: string;
    public tipoPessoa: TipoPessoa;
    public cnd: string;
    public idTenant: number;
    public tenant: Tenant;

    constructor(idPessoa: number, codigoPessoa: string, tipoPessoa: TipoPessoa, cnd: string, idTenant: number) {
        this.idPessoa = idPessoa;
        this.codigoPessoa = codigoPessoa;
        this.tipoPessoa = tipoPessoa;
        this.cnd = cnd;
        this.idTenant = idTenant;
    }
}