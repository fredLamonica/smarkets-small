import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Arquivo, TipoArquivo } from '@shared/models';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../base/unsubscriber';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
})
export class InputFileComponent extends Unsubscriber implements OnInit {

  @Input() multiple: boolean = false;
  // tslint:disable-next-line: no-input-rename
  @Input('accept') accept: string;
  @Output() select = new EventEmitter();

  private arquivosInvalidos: Array<Arquivo>;

  constructor(
    private toastr: ToastrService,
  ) { super(); }

  ngOnInit() {
  }

  selecionarArquivo(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.processarArquivos(fileList).pipe(takeUntil(this.unsubscribe)).subscribe((arquivos) => {

        if (this.extensoesValidas(arquivos)) {
          this.select.emit(arquivos);
          event.target.value = null;
        }

      });
    }
  }

  private processarArquivos(fileList: FileList): Observable<Array<Arquivo>> {
    const arquivos = new Array<Arquivo>();

    return new Observable((observer) => {
      for (let i = 0; i < fileList.length; i++) {
        const file: File = fileList[i];
        const reader = new FileReader();

        reader.onloadend = (e) => {
          const arquivo = new Arquivo(0, <string>reader.result, null, file.name, TipoArquivo.imagem);
          arquivo.tamanho = file.size;

          arquivos.push(arquivo);

          if (arquivos.length === fileList.length) {
            observer.next(arquivos);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  private extensoesValidas(arquivos: Array<Arquivo>): boolean {

    const arquivosInvalidos = arquivos.filter((a) => {
      if (!this.accept.toLowerCase().includes(a.nome.toLocaleLowerCase().split('.').pop())) {
        return true;
      } else {
        return false;
      }
    });

    if (arquivosInvalidos && arquivosInvalidos.length) {
      this.toastr.warning(`Extensão dos arquivos ${arquivosInvalidos.map((a) => a.nome).join(', ')} não são permitidas`);
      return false;
    }
    return true;
  }

}
