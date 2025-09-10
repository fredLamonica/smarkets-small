import { FaturamentoMinimoFrete } from "../faturamento-minimo-frete";
import { TipoFrete } from "../enums/tipo-frete";

export class FaturamentoMinimoFreteDto{
    public faturamentoBase: FaturamentoMinimoFrete;
    public tipos: Array<TipoFrete>;
}