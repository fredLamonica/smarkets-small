import { SituacaoRequisicaoItem } from '../enums/situacao-requisicao-item';

export class RequisicaoItemTramite {
    public idRequisicaoItemTramite: number;
    public idRequisicaoItem: number;
    public situacao: SituacaoRequisicaoItem;
    public dateTramite: string;

    constructor(idRequisicaoItemTramite: number, idRequisicaoItem: number, situacao: SituacaoRequisicaoItem, dateTramite: string) {
        this.idRequisicaoItemTramite = idRequisicaoItemTramite;
        this.idRequisicaoItem = idRequisicaoItem;
        this.situacao = situacao;
        this.dateTramite = dateTramite;
    }
}