import { CondicaoPagamento } from '..';
import { Situacao } from "../enums/situacao";
export class ContratoCatalogoCondicaoPagamento {
    public idContratoCatalogoCondicaoPagamento: number;
    public idContratoCatalogo: number;
    public idCondicaoPagamento: number;
    public condicaoPagamento: CondicaoPagamento;
    public situacao: Situacao;
    public dataInclusao: number;

    constructor(
        idContratoCatalogo: number,
        idCondicaoPagamento: number,
    ){
        this.idContratoCatalogo = idContratoCatalogo;
        this.idCondicaoPagamento = idCondicaoPagamento;
        this.situacao = Situacao.Ativo;
    }
}
