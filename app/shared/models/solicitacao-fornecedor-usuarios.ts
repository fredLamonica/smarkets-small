import { Permissao } from ".";
import { SituacaoUsuario } from "./enums/situacao-usuario";


export class SolicitacaoFornecedorUsuario{
    idSolicitacaoFornecedorUsuarios : number;
    idSolicitacaoFornecedor : number;
    status : SituacaoUsuario;
    nome : string;
    email : string;
    telefone : string;
    ramal : string;
    celular : string;
    dataExclusao : Date;
    permissoes : Array<Permissao>;

    constructor(
        idSolicitacaoFornecedorUsuarios : number,
        idSolicitacaoFornecedor : number,
        status : SituacaoUsuario,
        nome : string,
        email : string,
        telefone : string,
        ramal : string,
        celular : string,
        dataExclusao : Date,
        permissoes : Array<Permissao>){
        this.idSolicitacaoFornecedorUsuarios = idSolicitacaoFornecedorUsuarios;
        this.idSolicitacaoFornecedor = idSolicitacaoFornecedor;
        this.status = status;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.ramal = ramal;
        this.celular = celular;
        this.dataExclusao = dataExclusao;
        this.permissoes = permissoes;
    }
}