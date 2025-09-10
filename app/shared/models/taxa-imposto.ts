import { TipoImposto } from "./enums/tipo-imposto";

export class TaxaImposto {
    public IdTaxaImposto: number;
    public Valor: number;
    public Percentual: boolean;
    public IdUf: number;
    public IdCidade: number;
    public TipoImposto: TipoImposto;
}