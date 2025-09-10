import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { ConfiguracoesDto, PessoaJuridica, TipoAprovacao } from '@shared/models';
import { ConfiguracaoDash, ConfiguracaoDashLabel } from '@shared/models/enums/configuracao-dash';
import { PessoaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs-compat';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ModoAprovacao } from '../../../shared/models/enums/modo-aprovacao';
import { TipoAlcadaAprovacao } from '../../../shared/models/enums/tipo-alcada-aprovacao';
import { TipoIntegracao } from '../../../shared/models/enums/tipo-integracao';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'manter-configuracao-plataforma',
  templateUrl: './manter-configuracao-plataforma.component.html',
  styleUrls: ['./manter-configuracao-plataforma.component.scss'],
})
export class ManterConfiguracaoPlataformaComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  tipoAprovacao = TipoAprovacao;
  modoAprovacao = ModoAprovacao;
  tipoAlcadaAprovacao = TipoAlcadaAprovacao;

  modoAprovacaoValues = Object.values(this.modoAprovacao).filter(
    (e) => typeof e === 'number',
  );

  modoAprovacaoLabels = new Map<number, string>([
    [this.modoAprovacao.Nivel, 'Por Nível'],
    [this.modoAprovacao.Usuario, 'Por Usuário'],
  ]);

  modoAprovacaoTooltip = new Map<number, string>([
    [this.modoAprovacao.Nivel, 'Todos os usuários deverão fazer aprovação.'],
    [this.modoAprovacao.Usuario, 'Apenas um usuário deverá fazer aprovação.'],
  ]);

  idPessoaJuridica: number;
  empresaSelecionada: PessoaJuridica;
  idTenant: number;
  configuracoes: ConfiguracoesDto;
  form: FormGroup;
  isSmarkets: boolean;
  paramsSub: Subscription;

  configuracaoDash = ConfiguracaoDash;
  configuracaoDashLabel = ConfiguracaoDashLabel;

  tipoIntegracao = TipoIntegracao;

  configuracaoDashValues = Object.values(this.configuracaoDash).filter(
    (e) => typeof e === 'number',
  );

  constructor(
    public activeModal: NgbActiveModal,
    private pessoaJuridicaService: PessoaJuridicaService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private errorService: ErrorService,
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
    this.configuracoes = this.form.value;
    this.configuracoes.idPessoaJuridica = this.idPessoaJuridica;
    this.configuracoes.idTenant = this.idTenant;
    this.pessoaJuridicaService.alterarConfiguracoes(this.configuracoes).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response && response > 0) {
            this.toastr.success('As alterações entrarão em vigor no próximo login', 'Sucesso');
            this.activeModal.close();
          } else {
            this.toastr.error(
              'Falha ao salvar as configurações da empresa selecionada.',
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

  changeTipoAlcadaAprovacao(tipoAlcadaAprovacao: TipoAlcadaAprovacao): void {
    if (tipoAlcadaAprovacao === this.tipoAlcadaAprovacao.unificada) {
      this.form.controls.tipoAprovacao.setValue(null);
      this.form.controls.modoAprovacao.setValue(null);
    } else {
      this.form.controls.tipoAprovacao.setValue(this.tipoAprovacao.Departamento);
      this.form.controls.modoAprovacao.setValue(this.modoAprovacao.Nivel);
    }
  }

  changeTipoAprovacao(tipoAprovacao: TipoAprovacao): void {
    if (tipoAprovacao !== this.tipoAprovacao.Departamento) {
      this.form.controls.modoAprovacao.setValue(null);
    } else {
      this.form.controls.modoAprovacao.setValue(this.modoAprovacao.Nivel);
    }
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
      codigoNcmObrigatorio: [false],
      habilitarimpostoNcmCotacao: [false],
      aprovarRequisicoesAutomatico: [false],
      habilitarDesvinculoItemSolicitacaoCompra: [false],
      habilitarDepartamentoRequisicao: [false],
      habilitarModuloCotacao: [false],
      habilitarModuloFornecedores: [false],
      habilitarAlcadaUnificada: [false],
      tipoAlcadaAprovacao: [this.tipoAlcadaAprovacao.desmembrada],
      tipoAprovacao: [this.tipoAlcadaAprovacao.unificada ? null : this.tipoAprovacao.Departamento],
      modoAprovacao: [this.tipoAlcadaAprovacao.desmembrada && this.tipoAprovacao.Departamento ? this.modoAprovacao.Nivel : null],
      habilitarRestricaoAlcadasMatrizResp: [false],
      habilitarEnvelopeFechado: [false],
      usarCondicoesPagamentoPadraoSmarkets: [false],
      permiteCompraAcimaQuantidade: [false],
      configuracaoDash: [this.configuracoes ? this.configuracoes.configuracaoDash : null],
      centralizaHomologacao: [false],
      usarSLAPadraoSmarkets: [false],
      habilitarRegularizacao: [false],
      habilitarImobilizado: [false],
      habilitarMFA: [false],
      habilitarCompraAutomatizada: [null],
      tipoIntegracao: [null],
      habilitarTrack: [false],
      habilitarFup: [false],
      habilitarParadaManutencao: [false],
      habilitarQm: [false],
      habilitarZ1pz: [false],
    });

    this.ProcessarFormulario();
  }

  private ProcessarFormulario() {
    const controlesDependentes = [
      this.form.controls.habilitarFup,
      this.form.controls.habilitarZ1pz,
      this.form.controls.habilitarParadaManutencao,
      this.form.controls.habilitarQm
    ];

    const setEstadoControles = (habilitar: boolean) => {
      controlesDependentes.forEach(ctrl =>
        habilitar ? ctrl.enable() : ctrl.disable()
      );
    };

    setEstadoControles(this.form.controls.habilitarTrack.value);

    this.form.controls.habilitarTrack.valueChanges
      .pipe(takeUntil(this.unsubscribe), distinctUntilChanged())
      .subscribe((valor: boolean) => setEstadoControles(valor));
  }

  private preencherFormulario() {
    this.form.patchValue(this.configuracoes);
  }

  private obterConfiguracoes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.obterConfiguracoes(this.idPessoaJuridica).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.configuracoes = response;
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
