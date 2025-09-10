import { Arquivo, AcaoFornecedorComentario, SituacaoAcaoFornecedor, NotaAcaoFornecedor } from '.';

export class AcaoFornecedor {
    idAcaoFornecedor: number;
    idPlanoAcaoFornecedor: number;
    emailDoResponsavel: string;
    descricao: string;
    prazo: Date;
    situacao: SituacaoAcaoFornecedor;
    observacoes: string;
    dataFinalizacao?: Date;
    anexos: Array<Arquivo>;
    comentarios: Array<AcaoFornecedorComentario>;
    nota: NotaAcaoFornecedor;

    constructor(descricao: string, idPlanoAcaoFornecedor: number, prazo: Date, emailDoResponsavel: string){
        this.descricao = descricao;
        this.idPlanoAcaoFornecedor = idPlanoAcaoFornecedor;
        this.prazo = prazo;
        this.emailDoResponsavel = emailDoResponsavel;
    }
}