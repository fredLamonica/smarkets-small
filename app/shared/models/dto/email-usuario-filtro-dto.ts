import { SituacaoEmail } from "../enums/situacao-email";
import { TipoOperacaoTrack } from '../enums/Track/tipo-operacao-track';
import { FiltroBase } from '../fltros/base/filtro-base';

export interface EmailUsuarioFiltroDto extends FiltroBase {
  termo: string;
  situacaoEmail: SituacaoEmail;
  tipoOperacao: TipoOperacaoTrack;
}
