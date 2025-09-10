import { SituacaoEmail } from '../enums/situacao-email';
import { TipoEmail } from '../enums/tipo-email';

export interface EmailUsuarioDto {
  idImportacao: number;
  destinatario: string;
  situacao: SituacaoEmail;
  tipoEmail: TipoEmail;
}
