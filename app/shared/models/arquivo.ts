import { TipoArquivo } from './enums/tipo-arquivo';
export class Arquivo {

  idArquivo: number;
  url: string;
  extensao: string;
  nome: string;
  tipo: TipoArquivo;
  tamanho: number;
  nomeTamanho: string;

  get descricaoTamanho(): string {
    let indiceUnidade: number = 0;
    let tamanho = this.tamanho;

    while (tamanho >= 1024 && indiceUnidade < this.unidadesDeMedidas.length - 1) {
      indiceUnidade++;
      tamanho /= 1024;
    }

    return `${tamanho.toFixed(2)} ${this.unidadesDeMedidas[indiceUnidade]}`;
  }

  private unidadesDeMedidas: Array<string> = new Array<string>('B', 'KB', 'MB', 'GB', 'TB');

  constructor(idArquivo: number, url: string, extensao: string, nome: string, tipo: TipoArquivo) {
    this.idArquivo = idArquivo;
    this.url = url;
    this.extensao = extensao;
    this.nome = nome;
    this.tipo = tipo;
  }

}
