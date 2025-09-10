import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Arquivo, TipoArquivo } from '@shared/models';
import {
  ArquivoService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'sdk-manter-logo',
  templateUrl: './sdk-manter-logo.component.html',
  styleUrls: ['./sdk-manter-logo.component.scss']
})
export class SdkManterLogoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public oldLogo: string;
  public newLogo: string;
  public acceptedExtensions = '.png,.jpeg,.jpg,.svg';
  public isUpdate = false;
  private idPessoaJuridica: number;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private arquivoService: ArquivoService,
    private pessoaJuridicaService: PessoaJuridicaService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.preventEvents();
    this.getCompanyLogo();
  }

  public onTryUploadFile() {
    document.getElementById('inputFile').getElementsByTagName('input').item(0).click();
  }

  public selectFile(files: Arquivo[]) {
    try {
      if (files.length) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.arquivoService.inserir(files[0]).subscribe(
          response => {
            this.newLogo = response.url;
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
      }
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  public saveLogo() {
    if (this.newLogo) {
      if (this.idPessoaJuridica) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.pessoaJuridicaService.updateLogo(this.idPessoaJuridica, this.newLogo).subscribe(
          response => {
            this.activeModal.close();
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
      } else {
        this.activeModal.close(this.newLogo);
      }
    } else {
      this.toastr.warning('É necessário fornecer a logo para continuar.');
    }
  }

  private getCompanyLogo() {
    if (this.idPessoaJuridica) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.pessoaJuridicaService.getLogo(this.idPessoaJuridica).subscribe(
        response => {
          if (response && response.logo) {
            this.isUpdate = true;
            this.oldLogo = response.logo;
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }

  public async selectDroppedFile(event) {
    let fileList: FileList = event.dataTransfer.files;
    if (fileList.length > 0) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.processFiles(fileList).subscribe(files => {
        if (this.validExtensions(files)) {
          this.selectFile(files);
        } else {
          this.blockUI.stop();
        }
      });
    }
  }

  private processFiles(fileList: FileList): Observable<Array<Arquivo>> {
    let arquivos = new Array<Arquivo>();

    return new Observable(observer => {
      for (let i = 0; i < fileList.length; i++) {
        let file: File = fileList[i];
        let reader = new FileReader();

        reader.onloadend = e => {
          let arquivo = new Arquivo(0, <string>reader.result, null, file.name, TipoArquivo.imagem);
          arquivos.push(arquivo);

          if (arquivos.length == fileList.length) observer.next(arquivos);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  private validExtensions(arquivos: Array<Arquivo>): boolean {
    let validFiles = arquivos.filter(a => {
      if (
        !this.acceptedExtensions.toLowerCase().includes(a.nome.toLocaleLowerCase().split('.').pop())
      )
        return true;
      else return false;
    });

    if (validFiles && validFiles.length) {
      this.toastr.warning(
        `Extensão dos arquivos ${validFiles
          .map(a => {
            return a.nome;
          })
          .join(', ')} não são permitidas`
      );
      return false;
    }
    return true;
  }

  private preventEvents() {
    document.addEventListener(
      'dragover',
      function (event) {
        event.preventDefault();
      },
      false
    );

    document.addEventListener(
      'dragenter',
      function (event) {
        event.preventDefault();
      },
      false
    );

    document.addEventListener(
      'drop',
      function (event) {
        event.preventDefault();
      },
      false
    );
  }
}
