import { WarningResult } from '../interfaces/warning-result';
import { Notification } from '../notification';

export class AprovacaoContratoFornecedorDto implements WarningResult{
  linhasAlteradas: number;
  warnings: Array<Notification>;
}
