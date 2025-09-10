import { ImportType } from './enums/ImportType.enum';
import { Situacao } from './enums/situacao';

export class ImportacaoModelo {
  idModelo: number;
  nome: string;
  situacao: Situacao;
  importDate: Date;
  tipoImportacao: ImportType;
  versao: Number;
  dataCriacao: Date;
  motivo: string;
  url: string;
  idUsuario: number;
  tipoImportacaoTexto: string;
}
