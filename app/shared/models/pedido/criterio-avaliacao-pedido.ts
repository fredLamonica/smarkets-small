import { CategoriaProduto } from '../categoria-produto';

export class CriterioAvaliacaoPedido {
    public idCriterioAvaliacaoPedido: number;
    public idTenant: number;
    public descricao: string;
    public dataInicioVigencia: string;
    public dataFimVigencia: string;
    public categoriasProduto: Array<CategoriaProduto>;
}
