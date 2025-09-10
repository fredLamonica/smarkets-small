import { cnpj } from '@shared/validators/custom-validators.validator';


export class AprovacaoPedidoRelatorio {
    public Aprovador: string;
    public Cnpj: string;
    public CodPedido: string;
    public DataAprovacaoInterna: string;
    public DataConfirmacaoFornecedor: string;
    public DataPedido: string;
    public Fornecedor: string;
    public Pedido: number;
    public ValorPedido: number;
    public StatusPedido: string;

    constructor(Aprovador: string, 
        Cnpj: string, 
        CodPedido: string,
        DataAprovacaoInterna: string, 
        DataConfirmacaoFornecedor: string, 
        DataPedido: string,
        Fornecedor: string,
        Pedido: number,
        ValorPedido: number,
        StatusPedido: string) {

        this.Aprovador = Aprovador;
        this.Cnpj = Cnpj;
        this.CodPedido = CodPedido;
        this.DataAprovacaoInterna = DataAprovacaoInterna;
        this.DataConfirmacaoFornecedor = DataConfirmacaoFornecedor;
        this.DataPedido = DataPedido;
        this.Fornecedor = Fornecedor;
        this.Pedido = Pedido;
        this.ValorPedido = ValorPedido;
        this.StatusPedido = StatusPedido;
    }
}



