import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, Paginacao, PessoaJuridica } from '@shared/models';
import { TipoIntegracaoErp } from '@shared/models/enums/tipo-integracao-erp';
import { GestaoIntegracaoEmpresa } from '@shared/models/integracao-com-erp/gestao-integracao-empresa';
import { IntegracaoErp } from '@shared/models/integracao-com-erp/integracao-erp';
import { IntegracaoErpEmpresas } from '@shared/models/integracao-com-erp/integracao-erp-empresas';
import { TranslationLibraryService } from '@shared/providers';
import { IntegracaoErpService } from '@shared/providers/integracao-erp.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GestaoIntegracao } from '../../../models/integracao-com-erp/interfaces/gestao-integracao';

@Component({
  selector: 'app-manter-erp',
  templateUrl: './manter-erp.component.html',
  styleUrls: ['./manter-erp.component.scss'],
})
export class ManterErpComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  id: number; // ID da integração ERP.
  idVinculo: number; // ID do produto, da condição de pagamento ou do fornecedor

  title: string = '';
  source: Array<PessoaJuridica>;
  empresaSelecionada: Array<GestaoIntegracaoEmpresa> = [];
  tipoIntegracaoErp: TipoIntegracaoErp;
  form: FormGroup;
  settings: CustomTableSettings;
  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private integracaoService: IntegracaoErpService,
  ) {
    super();
  }

  ngOnInit() {
    this.construirFormulario();
    this.construirTabelas();

    if (this.id) {
      this.preencherFormulario();
    } else {
      this.obterEmpresasParaIntegracao();
    }
  }

  // #region inclusao
  salvarInclusoes(): void {
    if (this.formIsValid()) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.inclusaoGenerica().pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          () => {
            this.fechar(true);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          () => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }
  // #region end

  // #region edicao
  salvarEdicao(): void {
    if (this.formIsValid()) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.edicaoGenerica().pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          () => {
            this.fechar(true);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          () => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }
  // #region end

  buscar(): void {
    this.pagina = 1;
    this.obterEmpresasParaIntegracao();
  }

  campoBuscaChanged(): void {
    const termo: string = this.form.value.termo;

    if (termo == null || termo.length === 0) {
      this.buscar();
    }
  }

  paginacao(event: any): void {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterEmpresasParaIntegracao();
  }

  selecaoInclusao(selecao: Array<IntegracaoErp>): void {
    this.empresaSelecionada = selecao;
  }

  fechar(result: boolean = false): void {
    this.activeModal.close(result);
  }

  private obterEmpresasParaIntegracao(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.obterEmpresasGenerico().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.source = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.source = [];
            this.totalPaginas = 0;
          }
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private formIsValid(): boolean {
    if (!this.id && this.empresaSelecionada.length === 0) {
      this.toastr.warning('Selecione ao menos um empresa.');
      return false;
    }

    if (this.form.value.codigoIntegracao == null || this.form.value.codigoIntegracao === '') {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }

  private construirTabelas(): void {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('ID', 'idPessoaJuridica', CustomTableColumnType.text, null, null),
        new CustomTableColumn('Razão Social', 'razaoSocial', CustomTableColumnType.text, null, null),
        new CustomTableColumn('CNPJ', 'cnpj', CustomTableColumnType.text, null, null),
      ], this.id ? 'none' : 'check',
    );
  }

  private construirFormulario(): void {
    this.form = this.fb.group({
      termo: [''],
      codigoIntegracao: [null, Validators.required],
    });
  }

  private preencherFormulario(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.preencherFormularioGenerico().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.form.patchValue({ codigoIntegracao: response.codigoIntegracao });

          const integracao = {
            idPessoaJuridica: response.idPessoaJuridica,
            razaoSocial: response.razaoSocial,
            cnpj: response.cnpj,
          } as PessoaJuridica;

          this.source = [integracao];
          this.empresaSelecionada = [integracao];
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );

  }

  private inclusaoGenerica(): Observable<Array<IntegracaoErp>> {
    const integracaoErpEmpresas = new IntegracaoErpEmpresas({ codigoIntegracao: this.form.value.codigoIntegracao, empresas: this.empresaSelecionada });

    switch (this.tipoIntegracaoErp) {
      case TipoIntegracaoErp.produto:
        return this.integracaoService.postGestaoIntegracaoProduto(this.idVinculo, integracaoErpEmpresas);
      case TipoIntegracaoErp.fornecedor:
        return this.integracaoService.postGestaoIntegracaoFornecedor(this.idVinculo, integracaoErpEmpresas);
      case TipoIntegracaoErp.condicaoPagamento:
        return this.integracaoService.postGestaoIntegracaoCondicaoPagamento(this.idVinculo, integracaoErpEmpresas);
    }
  }

  private edicaoGenerica(): Observable<number> {
    switch (this.tipoIntegracaoErp) {
      case TipoIntegracaoErp.produto:
        return this.integracaoService.updateGestaoIntegracaoProduto(this.idVinculo, this.id, this.form.value.codigoIntegracao);
      case TipoIntegracaoErp.fornecedor:
        return this.integracaoService.updateGestaoIntegracaoFornecedor(this.idVinculo, this.id, this.form.value.codigoIntegracao);
      case TipoIntegracaoErp.condicaoPagamento:
        return this.integracaoService.updateGestaoIntegracaoCondicaoPagamento(this.id, this.form.value.codigoIntegracao);
    }
  }

  private preencherFormularioGenerico(): Observable<GestaoIntegracao> {
    switch (this.tipoIntegracaoErp) {
      case TipoIntegracaoErp.produto:
        return this.integracaoService.getGestaoIntegracaoProduto(this.idVinculo, this.id);
      case TipoIntegracaoErp.fornecedor:
        return this.integracaoService.getGestaoIntegracaoFornecedor(this.idVinculo, this.id);
      case TipoIntegracaoErp.condicaoPagamento:
        return this.integracaoService.getGestaoIntegracaoCondicaoPagamento(this.id);
    }
  }

  private obterEmpresasGenerico(): Observable<Paginacao<PessoaJuridica>> {
    const termo = this.form.value.termo;

    switch (this.tipoIntegracaoErp) {
      case TipoIntegracaoErp.produto:
        return this.integracaoService.obterEmpresasParaIntegracaoProduto(this.idVinculo, this.itensPorPagina, this.pagina, termo);
      case TipoIntegracaoErp.fornecedor:
        return this.integracaoService.obterEmpresasParaIntegracaoFornecedor(this.idVinculo, this.itensPorPagina, this.pagina, termo);
      case TipoIntegracaoErp.condicaoPagamento:
        return this.integracaoService.obterEmpresasParaIntegracaoCondicaoPagamento(this.idVinculo, this.itensPorPagina, this.pagina, termo);
    }
  }

}
