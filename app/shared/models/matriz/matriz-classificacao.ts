import { UnidadeMedidaTempo } from '../enums/unidade-medida-tempo';

export class MatrizClassificacao {
    public idMatrizClassificacao: number;
    public idMatrizResponsabilidade: number;
    public classificacao: string;
    public unidadeMedida: UnidadeMedidaTempo;
    public valor: number;
} 