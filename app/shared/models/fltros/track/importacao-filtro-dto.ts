import { TipoImportacao } from '../../enums/Track/tipo-importacao';
import { FiltroBase } from '../base/filtro-base';

export interface ImportacaoFiltroDto extends FiltroBase {
    termo: string;
    tipoImportacao: TipoImportacao;
}
