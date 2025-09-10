import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  SlaItem,
  CategoriaProduto,
  TipoSla,
  Sla,
  UnidadeMedidaTempo,
  Classificacao
} from '@shared/models';
import { CategoriaProdutoService, TranslationLibraryService, SlaService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ManterClassificacaoComponent } from '../manter-classificacao/manter-classificacao.component';

@Component({
  selector: 'app-manter-sla',
  templateUrl: './manter-sla.component.html',
  styleUrls: ['./manter-sla.component.scss']
})
export class ManterSlaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public TipoSla = TipoSla;
  public UnidadeMedidaTempo = UnidadeMedidaTempo;

  public form: FormGroup;

  public slaItem: SlaItem;

  public slas: Array<Sla>;

  public categorias: Array<CategoriaProduto>;
  public classificacoes: Array<Classificacao>;

  private subTipoSla: Subscription;
  private subIdSla: Subscription;

  constructor(
    private categoriaProdutoService: CategoriaProdutoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public slaService: SlaService,
    public modalService: NgbModal
  ) {}

  async ngOnInit() {
    await this.obterListas();
    this.construirFormulario();
    this.subForm();
    if (this.slaItem) this.preencherFormulario(this.slaItem);
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idSlaItem: [0],
      idTenant: [0],
      tipoSla: [null, Validators.required],
      idSla: [null, Validators.required],
      idClassificacao: [null, Validators.required],
      unidadeMedidaTempo: [null, Validators.required],
      tempo: [null, Validators.required],
      categoriasProduto: [new Array<CategoriaProduto>()],
      codigoErp: [null]
    });
    this.form.controls.idSla.disable();
    this.form.controls.categoriasProduto.disable();
  }

  public preencherFormulario(slaItem: SlaItem) {
    this.form.patchValue(slaItem);
  }

  public async obterListas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    try {
      this.categorias = await this.categoriaProdutoService.listar().toPromise();
      this.classificacoes = await this.slaService.listarClassificacoes().toPromise();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  private subForm() {
    this.subTipoSla = this.form.get('tipoSla').valueChanges.subscribe((tipoSla: TipoSla) => {
      this.form.controls.idSla.reset();
      this.form.controls.idSla.updateValueAndValidity();
      if (tipoSla) {
        this.obterSlas(tipoSla);
      } else {
        this.slas = new Array<Sla>();
        this.form.controls.idSla.disable();
      }
    });

    this.subIdSla = this.form.get('idSla').valueChanges.subscribe((idSla: number) => {
      this.habilitarSelecaoCategorias(idSla);
    });
  }

  private habilitarSelecaoCategorias(idSla: number) {
    if (idSla && this.slas) {
      let sla = this.slas.find(sla => sla.idSla == idSla);
      if (sla.permiteSegmentarPorCategoria) {
        this.form.controls.categoriasProduto.enable();
      } else {
        this.form.controls.categoriasProduto.reset();
        this.form.controls.categoriasProduto.disable();
      }
    }
  }

  private obterSlas(tipoSla) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.slaService.obterPorTipoSla(tipoSla).subscribe(
      response => {
        if (response) {
          this.slas = response;
          this.form.controls.idSla.enable();

          if (this.slaItem) this.habilitarSelecaoCategorias(this.form.value.idSla);
        }
        this.blockUI.stop();
      },
      responseError => {
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }

  public salvar() {
    if (this.formularioValido()) {
      let item = this.form.value;
      if (this.slaItem) this.alterar(item);
      else this.inserir(item);
    }
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }
    return true;
  }

  private inserir(item: SlaItem) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.slaService.inserirSlaItem(item).subscribe(
      response => {
        if (response) {
          response.sla = this.slas.find(sla => sla.idSla == response.idSla);
          response.classificacao = this.classificacoes.find(
            classificacao => classificacao.idClassificacao == response.idClassificacao
          );
          this.activeModal.close(response);
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      responseError => {
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }

  private alterar(item: SlaItem) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.slaService.alterarSlaItem(item).subscribe(
      response => {
        if (response) {
          item.sla = this.slas.find(sla => sla.idSla == item.idSla);
          item.classificacao = this.classificacoes.find(
            classificacao => classificacao.idClassificacao == item.idClassificacao
          );
          this.activeModal.close(item);
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      responseError => {
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }

  public cancelar() {
    this.activeModal.close();
  }

  public inserirClassificacao() {
    const modalRef = this.modalService.open(ManterClassificacaoComponent, { centered: true });
    modalRef.result.then(result => {
      if (result) {
        this.classificacoes.push(result);
      }
    });
  }
}
