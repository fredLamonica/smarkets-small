import { TipoRequisicao } from './requisicao/tipo-requisicao';

export class TipoPedido {
    public idTipoPedido: number;
    public idPessoa: number;
    public nomeTipoPedido: string;
    public siglaTipoPedido: string;
    public codigoTipoPedido: string;
    public tiposRequisicao: Array<TipoRequisicao>;
}