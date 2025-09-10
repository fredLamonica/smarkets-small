import { Arquivo, PessoaJuridica, Usuario } from '.';
import { ImportType } from './enums/ImportType.enum';
import { SituacaoImportacao } from './enums/situacao-importacao';

export class ImportGeneric {
  importId: number;
  importDate: Date;
  userIdImported: number;
  userImported: Usuario;
  totalImportedRecords: number;
  totalRecordsErrors: number;
  importedFileId: number;
  importedFile: Arquivo;
  fileErrorsId: number;
  errosFile: Arquivo;
  idTenant: number;
  importType: ImportType;
  buyer: PessoaJuridica;
  aiProcess: string;
  situacaoImportacao: SituacaoImportacao;
}
