import { SituacaoCampanha } from '..';
import { FilterBase } from './filter-base';

export class FranchiseCampaignFilter extends FilterBase {
  public idCampanhaFranquia: number;
  public titulo: string;
  public status: SituacaoCampanha;

  constructor(idCampanhaFranquia?: number, titulo?: string, status?: SituacaoCampanha) {
    super();
    this.idCampanhaFranquia = idCampanhaFranquia;
    this.titulo = titulo;
    this.status = status;
  }
}
