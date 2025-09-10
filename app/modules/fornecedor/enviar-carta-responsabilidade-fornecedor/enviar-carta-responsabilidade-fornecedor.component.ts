import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CartaResponsabilidadeFornecedor,
  Usuario,
  Arquivo,
  FornecedorInteressado
} from '@shared/models';
import {
  AutenticacaoService,
  TranslationLibraryService,
  ArquivoService,
  CartaResponsabilidadeFornecedorService
} from '@shared/providers';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enviar-carta-responsabilidade-fornecedor',
  templateUrl: './enviar-carta-responsabilidade-fornecedor.component.html',
  styleUrls: ['./enviar-carta-responsabilidade-fornecedor.component.scss']
})
export class EnviarCartaResponsabilidadeFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input() ViewLatter: CartaResponsabilidadeFornecedor;
  public fornecedor: FornecedorInteressado;
  public form: FormGroup = this.contruirFormulario();
  public usuariosGestoresParaDestinatario: Array<Usuario>;
  public carta: CartaResponsabilidadeFornecedor;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private cartaResponsabilidadeFornecedorService: CartaResponsabilidadeFornecedorService,
    private authService: AutenticacaoService,
    private arquivoService: ArquivoService
  ) {}

  ngOnInit() {
    this.obterParametros();
  }

  private contruirFormulario() {
    return this.fb.group({
      idCartaResponsabilidadeFornecedor: [0],
      idUsuarioDestinatario: ['', Validators.required],
      conteudo: ['', Validators.required],
      anexos: [new Array<Arquivo>()]
    });
  }

  private obterParametros() {
    let idTenant = this.authService.usuario().permissaoAtual.idTenant;
    this.cartaResponsabilidadeFornecedorService
      .obterUsuariosGestoresParaDestinatario(idTenant)
      .subscribe(response => {
        if (response) {
          this.usuariosGestoresParaDestinatario = response;
        }
      });

    if (this.ViewLatter) {
      this.form.controls.idUsuarioDestinatario.patchValue(this.ViewLatter.idUsuarioDestinatario);
      this.form.controls.conteudo.patchValue(this.ViewLatter.conteudo);
      this.form.controls.anexos.patchValue(this.ViewLatter.anexos);
    }
  }

  public fecharModal() {
    this.activeModal.close(false);
  }

  public enviar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      this.inserir();
      this.blockUI.stop();
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserir() {
    let carta: CartaResponsabilidadeFornecedor = this.form.value;
    carta.idFornecedor = this.fornecedor.idFornecedor;
    this.cartaResponsabilidadeFornecedorService.inserir(carta).subscribe(
      response => {
        if (response) {
          this.carta = response;
          this.activeModal.close(response);
          debugger;
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public async incluirArquivos(arquivos) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.arquivoService.inserir(arquivos[i]).toPromise();
      }
      this.form.patchValue({
        anexos: this.form.controls.anexos.value.concat(arquivos)
      });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  public excluirArquivo(arquivo) {
    // if (!this.form.controls.idVisitaTecnica.value) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.arquivoService.excluir(this.form.controls.anexos.value[arquivo.index].idArquivo).subscribe(
      response => {
        let anexos = this.form.controls.anexos.value;
        anexos.splice(arquivo.index, 1);
        this.form.patchValue({
          anexos: anexos
        });
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
    // } else {
    //   let anexos = this.form.controls.anexos.value;
    //   anexos.splice(arquivo.index, 1);
    //   this.form.patchValue({
    //     anexos: anexos
    //   });
    // }
  }

  public disabledForViewLetter() {
    if (this.ViewLatter) {
      return 'disabled';
    }
  }
}
