import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Arquivo } from '@shared/models';

@Component({
  selector: 'galeria-arquivos',
  templateUrl: './galeria-arquivos.component.html',
  styleUrls: ['./galeria-arquivos.component.scss']
})
export class GaleriaArquivosComponent implements OnInit {
  @Input() arquivos: Array<Arquivo>;
  @Output('excluir') excluirEmitter = new EventEmitter();
  @Input() disabled: boolean = false;
  @Input('exibir-nome') exibirNome: boolean = false;
  @Input() size: 'lg' | 'sm' = 'lg';
  @Input() fileClasses: string = 'col-6 col-md-3 col-xl-2 mb-3';

  constructor() {}

  ngOnInit() {}

  public download(index: number) {
    <any>window.open(this.arquivos[index].url);
  }

  public excluir(index: number) {
    this.excluirEmitter.emit({ arquivo: this.arquivos[index], index: index });
  }

  public iconeExtensao(index: number): string {
    switch (this.arquivos[index].extensao) {
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
