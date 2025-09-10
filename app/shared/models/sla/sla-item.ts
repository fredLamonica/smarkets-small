import { UnidadeMedidaTempo } from './../enums/unidade-medida-tempo';
import { CategoriaProduto } from '../categoria-produto';
import { TipoSla } from '../enums/tipo-sla';
import { Sla } from './sla';
import { Classificacao } from './classificacao';

export class SlaItem {
  public idSlaItem: number;
  public idTenant: number;
  public tipoSla: TipoSla;
  public idSla: number;
  public idClassificacao: number;
  public classificacao: Classificacao;
  public unidadeMedidaTempo: UnidadeMedidaTempo;
  public dataInclusao: string;
  public tempo: number;
  public categoriasProduto: Array<CategoriaProduto>;
  public sla: Sla;
  public codigoErp: string;

  constructor(
    idSlaItem: number,
    idTenant: number,
    tipoSla: TipoSla,
    idSla: number,
    idClassificacao: number,
    unidadeMedidaTempo: UnidadeMedidaTempo,
    dataInclusao: string,
    tempo: number,
    codigoErp: string
  ) {
    this.idSlaItem = idSlaItem;
    this.idTenant = idTenant;
    this.tipoSla = tipoSla;
    this.idSla = idSla;
    this.idClassificacao = idClassificacao;
    this.unidadeMedidaTempo = unidadeMedidaTempo;
    this.dataInclusao = dataInclusao;
    this.tempo = tempo;
    this.codigoErp = codigoErp;
  }
}
