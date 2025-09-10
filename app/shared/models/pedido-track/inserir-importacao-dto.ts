import { Arquivo } from '../arquivo';
import { TipoImportacao } from '../enums/Track/tipo-importacao';


export interface InserirImportacaoDto{
    arquivo: Arquivo;
    idTenant: number;
    tipoImportacao: TipoImportacao;
}
