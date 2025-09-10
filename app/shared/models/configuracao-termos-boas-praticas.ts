import { Arquivo } from './arquivo';
import { UnidadeMedidaTempo } from './enums/unidade-medida-tempo';

export class ConfiguracaoTermosBoasPraticas {
    public idConfiguracaoTermosBoasPraticas: number;
    public idArquivo: number;
    public arquivo: Arquivo;
    public habilitado: boolean;
    public quantidadeTempo: number;
    public unidadeMedidaTempo: UnidadeMedidaTempo
}