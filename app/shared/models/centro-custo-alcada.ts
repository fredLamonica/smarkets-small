import { Usuario } from "./usuario";
import { Situacao } from "./enums/situacao";
import { CategoriaProduto } from './categoria-produto';
import { Moeda } from './enums/moeda';

export class CentroCustoAlcada {
    public idCentroCustoAlcada: number;
    public idCentroCusto: number;
    public idTenant: number;    
    public situacao: Situacao;
    public codigo: string;
    public descricao: string;
    public moeda: Moeda;
    public valor: number;
    public idAprovador: number;
    public aprovador: Usuario;
    public utilizaTodasCategorias: boolean;
    public categoriasProduto: Array<CategoriaProduto>
}