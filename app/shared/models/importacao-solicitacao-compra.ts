import { Arquivo, Usuario } from '.';

export class ImportacaoSolicitacaoCompra {
  public idImportacaoSolicitacaoCompra: number;
  public dataImportacao: Date;
  public idUsuarioImportou: number;
  public usuarioImportou: Usuario;
  public totalRegistrosImportados: number;
  public totalRegistrosComErros: number;
  public idArquivoImportado: number;
  public arquivoImportado: Arquivo;
  public idArquivoErros: number;
  public arquivoErros: Arquivo;
  public idTenant: number;
}
