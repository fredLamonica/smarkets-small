import { ArquivoDto } from './arquivo-dto';

export class CotacaoRodadaArquivoDto {
  public idCotacaoRodada: number;
  public ordem: number;
  public arquivos: Array<ArquivoDto>;

  constructor(cotacaoRodadaArquivo: CotacaoRodadaArquivoDto) {
    if (!cotacaoRodadaArquivo) {
      return;
    }

    this.ordem = cotacaoRodadaArquivo.ordem;
    this.idCotacaoRodada = cotacaoRodadaArquivo.idCotacaoRodada;
    this.preencherArquivos(cotacaoRodadaArquivo.arquivos);
  }

  private preencherArquivos(arquivos: Array<ArquivoDto>) {
    if (!arquivos) {
      return;
    }

    this.arquivos = new Array<ArquivoDto>();

    arquivos.map(arquivo => this.arquivos.push(new ArquivoDto(arquivo)));
  }
}
