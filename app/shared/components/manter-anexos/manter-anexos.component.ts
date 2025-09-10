import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { ModalConfirmacaoExclusao } from '../../../shared/components';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { Arquivo } from '../../../shared/models';
import { ArquivoService } from '../../../shared/providers';
import { Anexo } from '../../models/interfaces/anexo';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-anexos',
  templateUrl: './manter-anexos.component.html',
  styleUrls: ['./manter-anexos.component.scss'],
})
export class ManterAnexosComponent extends Unsubscriber implements OnInit {

  @Input() anexos: Array<Anexo>;
  @Input() extensoesPermitidas: Array<string> = new Array<string>('pdf', 'png', 'jpeg', 'jpg', 'txt');
  @Input() tamanhoMaximo: string = '5MB';
  @Input() quantidadeMaxima: number = 3;
  @Input() podeBaixar: boolean = true;
  @Input() readOnly: boolean;
  @Output() anexarArquivos: EventEmitter<Array<Arquivo>> = new EventEmitter<Array<Arquivo>>();
  @Output() excluirAnexo: EventEmitter<Anexo> = new EventEmitter<Anexo>();

  accept: string;

  private extensoesPermitidasAccept: Array<string>;

  constructor(private modalService: NgbModal, private arquivoService: ArquivoService) {
    super();
  }

  ngOnInit() {
    this.extensoesPermitidasAccept = this.extensoesPermitidas.map((extensao) => {
      extensao = extensao.trim();

      if (extensao.indexOf('.') !== 0) {
        extensao = `.${extensao}`;
      }

      return extensao;
    });

    this.accept = this.extensoesPermitidasAccept.join(',');
    this.extensoesPermitidas = this.extensoesPermitidas.map((x) => x.trim().replace(/\./g, ''));
  }

  enviarArquivosParaInsercao(arquivos: Array<Arquivo>) {
    this.anexarArquivos.emit(arquivos);
  }

  solicitarExclusaoDeAnexo(anexo: Anexo) {
    this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      () => this.enviarAnexoParaExclusao(anexo),
      () => { },
    );
  }

  download(arquivo: Arquivo) {
    this.arquivoService.download(arquivo.idArquivo).pipe(takeUntil(this.unsubscribe)).subscribe((file) => {
      this.createElementFromDownload(file, arquivo.nome);
    });
  }

  private enviarAnexoParaExclusao(anexo: Anexo) {
    this.excluirAnexo.emit(anexo);
  }

  private createElementFromDownload(file: any, nomeArquivo: string) {
    const newBlob = new Blob([file]);
    const data = window.URL.createObjectURL(newBlob);

    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', nomeArquivo);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
