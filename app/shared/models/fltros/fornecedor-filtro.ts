import { SituacaoQuestionarioFornecedor } from '..';
import { StatusDocumentoFornecedor } from '../enums/status-documento-fornecedor';
import { StatusFornecedor } from '../enums/status-fornecedor';
import { StatusPendenciaFornecedor } from '../enums/status-pendencia-fornecedor';
import { StatusPlanoAcaoFornecedor } from '../enums/status-plano-acao-fornecedor';

export class FornecedorFiltro {
  public tipoRede: string;
  public statusFornecedor: StatusFornecedor;
  public documento: string;
  public razaoSocial: string;
  public codigoErp: string;

  public statusDocumento: StatusDocumentoFornecedor;
  public situacaoQuestionario: SituacaoQuestionarioFornecedor;
  public statusPlanoAcao: StatusPlanoAcaoFornecedor;
  public statusPendencia: StatusPendenciaFornecedor;

  public pagina: number;
  public itensPagina: number;
}
