import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CentroCusto, ContratoCatalogoItem, ContratoCatalogoParticipante, Situacao, SituacaoContratoCatalogoItem, Usuario } from '@shared/models';
import { ContratoCatalogoParticipanteItem } from '@shared/models/contrato-catalogo/contrato-catalogo-participante-item';
import { AutenticacaoService, CentroCustoService, TranslationLibraryService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { Alcada } from '../../../../shared/models/alcada';
import { TipoAlcadaAprovacao } from '../../../../shared/models/enums/tipo-alcada-aprovacao';
import { AlcadaService } from '../../../../shared/providers/alcada.service';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';

@Component({
  selector: 'app-produtos-itens-participante',
  templateUrl: './produtos-itens-participante.component.html',
  styleUrls: ['./produtos-itens-participante.component.scss'],
})
export class ProdutosItensParticipanteComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  contratoCatalogoParticipanteItem: ContratoCatalogoParticipanteItem;

  Situacao = SituacaoContratoCatalogoItem;
  // tslint:disable-next-line: no-input-rename
  @Input('participante') participante: ContratoCatalogoParticipante;
  // tslint:disable-next-line: no-input-rename
  @Input('id-contrato') idContrato: number;
  centroCusto: Array<CentroCusto>;
  itens: Array<ContratoCatalogoItem>;
  selecionado: Array<ContratoCatalogoParticipanteItem>;

  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAlcadaAprovacaoEnum = TipoAlcadaAprovacao;
  alcadas: Array<Alcada>;
  usuarioAtual: Usuario;

  constructor(
    public activeModal: NgbActiveModal,
    private translationLibrary: TranslationLibraryService,
    private contratoService: ContratoCatalogoService,
    private centroCustoService: CentroCustoService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private authService: AutenticacaoService,
    private alcadaService: AlcadaService,
  ) {
    super();
  }

  ngOnInit() {
    this.obterItens();
    this.obterCentroCustos();
    this.obterAlcadas();
    this.usuarioAtual = this.authService.usuario();
    this.tipoAlcadaAprovacao = this.usuarioAtual.permissaoAtual.pessoaJuridica.tipoAlcadaAprovacao;
    this.construirFormulario();

    if (this.contratoCatalogoParticipanteItem) {
      this.preencherFormulario(this.contratoCatalogoParticipanteItem);
    }
  }

  confirmar() {
    this.activeModal.close(true);
  }

  cancelar() {
    this.activeModal.close(false);
  }

  construirFormulario() {
    this.form = this.formBuilder.group({
      idContratoCatalogoParticipanteItem: [0, Validators.required],
      idCentroCusto: [null, Validators.required],
      idAlcada: [null, Validators.required],
      idContratoCatalogoParticipante: [this.participante.idContratoCatalogoParticipante],
      idContratoCatalogoItem: [null, Validators.required],
      quantidadeTotal: [null, Validators.required],
      quantidadeSolicitada: [0],
      quantidadeDisponivel: [0],
      situacao: [Situacao.Ativo, Validators.required],
    });
  }

  obterItens() {
    if (!this.itens) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.contratoService.obterItens(this.idContrato).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            if (response) {
              this.itens = response;
            } else {
              this.itens = new Array<ContratoCatalogoItem>();
            }
            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }

  obterCentroCustos() {
    if (!this.centroCusto) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.centroCustoService.listarPorEmpresa(this.participante.idPessoaJuridica).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            if (response) {
              this.centroCusto = response;
            } else {
              this.itens = new Array<ContratoCatalogoItem>();
            }
            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }

  obterAlcadas() {
    if (!this.alcadas) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.alcadaService.listar().pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            if (response) {
              this.alcadas = response;
            } else {
              this.itens = new Array<ContratoCatalogoItem>();
            }
            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }

  preencherFormulario(item: ContratoCatalogoParticipanteItem) {
    this.form.patchValue(item);
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      if (!this.contratoCatalogoParticipanteItem) {
        const item = this.form.value;
        this.inserir(item);
      } else {
        const item = this.form.value;
        this.alterar(item);
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  onChange($event: ContratoCatalogoParticipanteItem) {
    if (this.contratoCatalogoParticipanteItem) {
      this.form.controls.quantidadeTotal.setValue(null);
      this.form.controls.quantidadeSolicitada.setValue(null);
      this.form.controls.quantidadeDisponivel.setValue(null);
    }
  }

  compareContratoCatalogoItem(a, b): boolean {
    return a.idContratoCatalogoItem === b;
  }

  private inserir(item: ContratoCatalogoParticipanteItem) {
    this.contratoService
      .inserirContratoCatalogoParticipanteItem(
        this.idContrato,
        this.participante.idContratoCatalogoParticipante,
        item,
      )
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.confirmar();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }
  private alterar(item: ContratoCatalogoParticipanteItem) {
    this.contratoService
      .alterarParticipanteItemContrato(
        this.idContrato,
        this.participante.idContratoCatalogoParticipante,
        item,
      )
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.confirmar();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }
}
