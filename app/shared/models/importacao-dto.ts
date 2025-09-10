import { SituacaoImportacao } from './enums/situacao-importacao';

export interface ImportacaoDto {
    id: number;
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
