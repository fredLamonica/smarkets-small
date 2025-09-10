import { Pessoa } from "./pessoa";
import { TipoPessoa } from "./enums/tipo-pessoa";

export class PessoaFisica extends Pessoa {
    public idPessoaFisica: number;
    public nome: string;

    constructor();
    
    constructor(
        idPessoa: number,
        codigoPessoa: string,
        tipoPessoa: TipoPessoa,
        cnd: string,
        idTenant: number,
        idPessoaFisica: number,
        nome: string,
    );
    
    constructor(
        idPessoa?: number,
        codigoPessoa?: string,
        tipoPessoa?: TipoPessoa,
        cnd?: string,
        idTenant?: number,
        idPessoaFisica?: number,
        nome?: string,
    ) {
        super(idPessoa, codigoPessoa, tipoPessoa, cnd, idTenant);
        this.idPessoaFisica = idPessoaFisica;
        this.nome = nome;
    }
}