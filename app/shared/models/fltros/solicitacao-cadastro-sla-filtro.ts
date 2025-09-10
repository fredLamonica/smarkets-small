import { SituacaoSolicitacaoCadastroSla, SituacaoSolicitacaoCadastroSlaLabel } from '../enums/situacao-solicitacao-cadastro-sla';
import { TipoClassificacaoSla, TipoClassificacaoSlaLabel } from '../enums/tipo-classificacao-sla';
import { TipoSolicatacaoCadastroSla, TipoSolicatacaoCadastroSlaLabel } from '../enums/tipo-solicitacao-cadastro-sla';
import { FilterBase } from './filter-base';

export class SolicitacaoCadastroSlaFiltro extends FilterBase {
    public classificacao: TipoClassificacaoSla;   
    public status: SituacaoSolicitacaoCadastroSla;
    public tipo: TipoSolicatacaoCadastroSla

    private statusSolicitacaoCadastroSlaLabel = SituacaoSolicitacaoCadastroSlaLabel;
    private tipoSolicitacaoCadastroSlaLabel = TipoSolicatacaoCadastroSlaLabel;
    private tipoClassificacaoSlaLabel = TipoClassificacaoSlaLabel;

    set _status(value: any) {
      if (value) this.status = this.getKeyByValue(this.statusSolicitacaoCadastroSlaLabel, value.label);
      else this.status = null;
    }
    get _status(): any {
      return this.statusSolicitacaoCadastroSlaLabel.get(this.status);
    }

    set _tipo(value: any) {
      if (value) this.tipo = this.getKeyByValue(this.tipoSolicitacaoCadastroSlaLabel, value.label);
      else this.tipo = null;
    }    

    get _tipo(): any {
      return this.tipoSolicitacaoCadastroSlaLabel.get(this.tipo);
    }

    set _classificacao(value : any){
      if (value) this.classificacao = this.getKeyByValue(this.tipoClassificacaoSlaLabel, value.label);
      else this.tipo = null;
    }

    get _classificacao(){
      return this.tipoClassificacaoSlaLabel.get(this.classificacao);
    }
  
    private getKeyByValue(dictionary: Map<number, string>, value): number {
      return Array.from(dictionary.keys()).find(key => dictionary.get(key).valueOf() == value);
    }
  }