import { TipoSla } from '../enums/tipo-sla';

export class Sla {
  public idSla: number;
  public tipoSla: TipoSla;
  public descricao: string;
  public permiteSegmentarPorCategoria: boolean;

  constructor(
    idSla: number,
    tipoSla: TipoSla,
    descricao: string,
    permiteSegmentarPorCategoria: boolean
  ) {
    this.idSla = idSla;
    this.tipoSla = tipoSla;
    this.descricao = descricao;
    this.permiteSegmentarPorCategoria = permiteSegmentarPorCategoria;
  }
}
