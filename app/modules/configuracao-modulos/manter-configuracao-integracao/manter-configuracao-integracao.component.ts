import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs-compat';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PessoaJuridica } from '../../../shared/models';
import { ConfiguracoesIntegracaoDto } from '../../../shared/models/dto/configuracoes-integracao-dto';
import { FluxoAprovacaoInternaPedido } from '../../../shared/models/enums/fluxo-aprovacao-interna-pedido';
import { TranslationLibraryService } from '../../../shared/providers';
import { ConfiguracaoDeModuloIntegracaoService } from '../../../shared/providers/configuracao-de-modulo-integracao-service';
import { ErrorService } from '../../../shared/utils/error.service';
import { TipoIntegracao } from './../../../shared/models/enums/tipo-integracao';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'manter-configuracao-integracao',
  templateUrl: './manter-configuracao-integracao.component.html',
  styleUrls: ['./manter-configuracao-integracao.component.scss'],
})
export class ManterConfiguracaoIntegracaoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  idPessoaJuridica: number;
  empresaSelecionada: PessoaJuridica;
  idTenant: number;

  form: FormGroup;
  paramsSub: Subscription;
  isSmarkets: boolean;

  tipoIntegracao = TipoIntegracao;
  fluxoAprovacaoInternaPedido = FluxoAprovacaoInternaPedido;
  configuracoesIntegracao: ConfiguracoesIntegracaoDto;

  constructor(
    public activeModal: NgbActiveModal,
    private configuracaoDeModuloIntegracao: ConfiguracaoDeModuloIntegracaoService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
  ) {
    super();
  }

  ngOnInit() {
    this.obterParametros();
    this.construirFormulario();
    this.obterConfiguracoes();
    this.setIsSmarkets();
    this.toastr.clear();
  }

  salvar() {
    this.blockUI.start();
    this.configuracoesIntegracao = this.form.value;
    this.configuracoesIntegracao.idPessoaJuridica = this.idPessoaJuridica;
    this.configuracoesIntegracao.idTenant = this.idTenant;
    this.configuracaoDeModuloIntegracao.put(this.configuracoesIntegracao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success('As alterações das integrações entrarão em vigor no próximo login', 'Sucesso');
            this.activeModal.close();
          } else {
            this.toastr.error(
              'Falha ao salvar as configurações de integração da empresa selecionada.',
            );
          }
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  cancelar() {
    this.activeModal.close();
  }

  processarFormulario() {
    this.form.controls.tipoIntegracao.valueChanges.pipe(
      takeUntil(this.unsubscribe),
      distinctUntilChanged())
      .subscribe(() => {
        if (this.form.controls.tipoIntegracao.value !== this.tipoIntegracao.SAP) {
          this.form.patchValue({

            bloquearRequisicaoPedido: false,
            parametrosIntegracaoSapHabilitado: false,
            exibirFlagSapEm: false,
            exibirFlagSapEmNaoAvaliada: false,
            exibirFlagSapEntrFaturas: false,
            exibirFlagSapRevFatEm: false,
            origemMaterialObrigatorio: false,
            utilizacaoMaterialObrigatorio: false,
            categoriaMaterialObrigatorio: false,
          });

          this.form.controls.bloquearRequisicaoPedido.disable();
          this.form.controls.parametrosIntegracaoSapHabilitado.disable();
          this.form.controls.exibirFlagSapEm.disable();
          this.form.controls.exibirFlagSapEmNaoAvaliada.disable();
          this.form.controls.exibirFlagSapEntrFaturas.disable();
          this.form.controls.exibirFlagSapRevFatEm.disable();
          this.form.controls.origemMaterialObrigatorio.disable();
          this.form.controls.utilizacaoMaterialObrigatorio.disable();
          this.form.controls.categoriaMaterialObrigatorio.disable();
          this.form.controls.permiteAlterarValorReferencia.disable();
          this.form.controls.habilitarIntegracaoERP.enable();
        } else {
          this.form.patchValue({
            habilitarIntegracaoERP: false,
            habilitarAprovacaoPedidoAutomaticaSAPERP: false,
          });

          this.form.controls.parametrosIntegracaoSapHabilitado.enable();
          this.form.controls.habilitarIntegracaoERP.disable();
          this.form.controls.habilitarAprovacaoPedidoAutomaticaSAPERP.disable();
        }

        if (this.form.controls.tipoIntegracao.value === this.tipoIntegracao.ERP) {

          this.form.patchValue({
            utilizaSolicitacaoCompra: false,
            integracaoSapHabilitada: false,
            aprovarRequisicoesAutomatico: false,
            habilitarRegularizacao: false,
            habilitarAprovacaoPedidoAutomaticaSAPERP: false,
          });

          this.form.controls.habilitarAprovacaoAutomaticaRequisicao.enable();
          this.form.controls.habilitarAprovacaoAutomaticaPedido.enable();
          this.form.controls.habilitarIntegracaoSistemaChamado.enable();
          this.form.controls.integracaoSapHabilitada.disable();
          this.form.controls.habilitarAprovacaoPedidoAutomaticaSAPERP.disable();
          this.form.controls.utilizaSolicitacaoCompra.disable();

        } else {

          this.form.patchValue({
            habilitarAprovacaoAutomaticaRequisicao: false,
            habilitarAprovacaoAutomaticaPedido: false,
            habilitarIntegracaoSistemaChamado: false,
            habilitarRegularizacao: false,
          });

          this.form.controls.utilizaSolicitacaoCompra.enable();
          this.form.controls.habilitarAprovacaoAutomaticaRequisicao.disable();
          this.form.controls.habilitarAprovacaoAutomaticaPedido.disable();
          this.form.controls.habilitarIntegracaoSistemaChamado.disable();
          this.form.controls.integracaoSapHabilitada.enable();
        }
      });

    this.form.get('parametrosIntegracaoSapHabilitado').valueChanges.pipe(
      takeUntil(this.unsubscribe),
      distinctUntilChanged())
      .subscribe((response) => {
        if (!response) {
          this.form.patchValue({
            exibirFlagSapEm: false,
            exibirFlagSapEmNaoAvaliada: false,
            exibirFlagSapEntrFaturas: false,
            exibirFlagSapRevFatEm: false,
            origemMaterialObrigatorio: false,
            utilizacaoMaterialObrigatorio: false,
            categoriaMaterialObrigatorio: false,
          });

          this.form.controls.exibirFlagSapEm.disable();
          this.form.controls.exibirFlagSapEmNaoAvaliada.disable();
          this.form.controls.exibirFlagSapEntrFaturas.disable();
          this.form.controls.exibirFlagSapRevFatEm.disable();
          this.form.controls.origemMaterialObrigatorio.disable();
          this.form.controls.utilizacaoMaterialObrigatorio.disable();
          this.form.controls.categoriaMaterialObrigatorio.disable();
        } else {
          this.form.controls.exibirFlagSapEm.enable();
          this.form.controls.exibirFlagSapEmNaoAvaliada.enable();
          this.form.controls.exibirFlagSapEntrFaturas.enable();
          this.form.controls.exibirFlagSapRevFatEm.enable();
          this.form.controls.origemMaterialObrigatorio.enable();
          this.form.controls.utilizacaoMaterialObrigatorio.enable();
          this.form.controls.categoriaMaterialObrigatorio.enable();
        }
      });

    this.form.get('utilizaSolicitacaoCompra').valueChanges.pipe(
      takeUntil(this.unsubscribe),
      distinctUntilChanged())
      .subscribe((response) => {
        if (!response) {
          this.form.patchValue({
            bloquearRequisicaoPedido: false,
            permiteAlterarValorReferencia: false,
          });

          this.form.controls.bloquearRequisicaoPedido.disable();
          this.form.controls.permiteAlterarValorReferencia.disable();
        } else {
          this.form.controls.bloquearRequisicaoPedido.enable();
          this.form.controls.permiteAlterarValorReferencia.enable();
        }
      });

    this.form.get('habilitarAprovacaoPedidoAutomaticaSAPERP').valueChanges.pipe(
      takeUntil(this.unsubscribe),
      distinctUntilChanged())
      .subscribe((response) => {
        if (response && this.form.value.tipoIntegracao == TipoIntegracao.API) {
          this.form.controls.valorLimiteAprovacaoAutomaticaPedido.enable();
        } else {
          this.form.controls.valorLimiteAprovacaoAutomaticaPedido.disable();
        }
      });

  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idPessoaJuridica = +params['idPessoaJuridica'];
      });
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      integrarApiPedidos: [false],
      integracaoSapHabilitada: [false],
      utilizaSolicitacaoCompra: [false],
      bloquearRequisicaoPedido: [false],
      parametrosIntegracaoSapHabilitado: [false],
      exibirFlagSapEm: [false],
      exibirFlagSapEmNaoAvaliada: [false],
      exibirFlagSapEntrFaturas: [false],
      exibirFlagSapRevFatEm: [false],
      origemMaterialObrigatorio: [false],
      utilizacaoMaterialObrigatorio: [false],
      categoriaMaterialObrigatorio: [false],
      permiteAlterarValorReferencia: [false],
      habilitarIntegracaoERP: [false],
      habilitarAprovacaoAutomaticaRequisicao: [false],
      habilitarAprovacaoAutomaticaPedido: [false],
      habilitarIntegracaoSistemaChamado: [false],
      tipoIntegracao: [null],
      permiteReenvioPedido: [null],
      permiteReenvioRequisicao: [null],
      permiteReenvioRegularizacao: [null],
      habilitarAprovacaoPedidoAutomaticaSAPERP: [null],
      valorLimiteAprovacaoAutomaticaPedido: [null],
      fluxoAprovacaoInternaPedido: [null],
    });

    this.processarFormulario();
  }

  private preencherFormulario() {
    this.form.patchValue(this.configuracoesIntegracao);
  }

  private obterConfiguracoes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.configuracaoDeModuloIntegracao.getDto(this.idPessoaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.configuracoesIntegracao = response;
            this.preencherFormulario();
          } else {
            this.toastr.error(
              'Falha ao obter as configurações de integração da empresa selecionada.',
            );
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private setIsSmarkets() {
    this.isSmarkets = this.idTenant === 1 ? true : false;
  }

}
