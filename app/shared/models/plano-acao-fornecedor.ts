import { StatusPlanoAcaoFornecedor } from './enums/status-plano-acao-fornecedor';
import { AcaoFornecedor, Usuario, Fornecedor } from '.';

export class PlanoAcaoFornecedor {
    public idPlanoAcaoFornecedor: number;
    public idTenant: number;
    public idFornecedor: number;
    public nome: string;
    public prazo: Date;
    public idUsuarioResponsavel: number;
    public usuarioResponsavel: Usuario;
    public fornecedor: Fornecedor;
    public status: StatusPlanoAcaoFornecedor;
    public acoes: Array<AcaoFornecedor>;

    constructor(){
        this.status = StatusPlanoAcaoFornecedor["Em Andamento"];
        this.acoes = new Array<AcaoFornecedor>();
    }
}