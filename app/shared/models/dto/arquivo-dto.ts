export class ArquivoDto {
  public idArquivo: number;
  public nome: string;
  public dataInclusao: Date;
  public extensao: string;
  public url: string;

  constructor(arquivo: ArquivoDto) {
    if (!arquivo) {
      return;
    }

    this.idArquivo = arquivo.idArquivo;
    this.nome = arquivo.nome;
    this.dataInclusao = arquivo.dataInclusao;
    this.extensao = arquivo.extensao;
    this.url = arquivo.url;
  }

  public obterNomeArquivo(): string {
    return this.nome.replace(this.extensao, '');
  }

  public obterCorIcone(): string {
    switch (this.extensao) {
      case '.docx':
      case '.doc':
      case '.png':
      case '.jpeg':
      case '.jpg':
        return '#00bbf3';
      case '.pdf':
      case '.pptx':
        return 'red';
      case '.xlsx':
      case '.xls':
        return 'green';
      default:
        return 'gray';
    }
  }

  public obterIcone(): string {
    switch (this.extensao) {
      case '.docx':
        return 'far fa-file-word';
      case '.doc':
        return 'far fa-file-word';
      case '.xlsx':
        return 'far fa-file-excel';
      case '.xls':
        return 'far fa-file-excel';
      case '.pptx':
        return 'far fa-file-powerpoint';
      case '.ppt':
        return 'far fa-file-powerpoint';
      case '.csv':
        return 'fas fa-file-csv';
      case '.pdf':
        return 'far fa-file-pdf';
      case '.png':
        return 'far fa-file-image';
      case '.jpeg':
        return 'far fa-file-image';
      case '.jpg':
        return 'far fa-file-image';
      case '.txt':
        return 'far fa-file-alt';
      default:
        return 'far fa-file';
    }
  }
}
