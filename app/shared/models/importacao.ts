import { SituacaoImportacao } from './enums/situacao-importacao';

export class Importacao {
  idImportacao: number;
  dataCriacao: Date;
  dataFinalizacao: Date;
  idArquivo: number;
  arquivoNome: string;
  idTenant: number;
  qtdTotal: number;
  qtdProcessado: number;
  qtdErro: number;
  usuarioNome: string;
  razaoSocial: string;
  situacaoImportacao: SituacaoImportacao;
  situacaoImportacaoDescricao: string;
  percentualProcessado: string;
  percentualErro: string;
}
