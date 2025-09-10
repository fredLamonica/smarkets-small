import { Pessoa } from './pessoa';
import { Cidade } from './cidade';
import { TipoEndereco } from './enums/tipo-endereco';
import { Estado } from './estado';
import { RegraFaturamento } from './enums/regra-faturamento';
import { TipoFrete } from './enums/tipo-frete';

export class FaturamentoMinimoFrete {
    public idFaturamentoMinimoFrete: number;
    public idPessoa: number;
    public idPais: number;
    public idEstado: number;
    public idCidade: number;
    public idTenant: number;
    public estado: Estado;
    public cidade: Cidade;
    public valor: number;
    public regra: RegraFaturamento;
    public tipoFrete: TipoFrete;

    constructor(
        idFaturamentoMinimoFrete: number,
        idPessoa: number,
        idPais: number,
        idEstado: number, 
        idCidade: number,
        idTenant: number,
        estado: Estado,
        cidade: Cidade,
        valor: number, 
        regra: RegraFaturamento,
        tipoFrete: TipoFrete
    ) {
        this.idFaturamentoMinimoFrete = idFaturamentoMinimoFrete;
        this.idPessoa = idPessoa;
        this.idPais = idPais;
        this.idEstado = idEstado;
        this.idCidade = idCidade;
        this.cidade = cidade;
        this.idTenant = idTenant;
        this.estado = estado;
        this.valor = valor;
        this.regra = regra;
        this.tipoFrete = tipoFrete;
    }
}