import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CentroCusto, Situacao, Usuario } from '@shared/models';
import { AutenticacaoService, CentroCustoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { TipoAlcadaAprovacao } from '../../../shared/models/enums/tipo-alcada-aprovacao';
import { UsuarioService } from '../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-centro-custo',
  templateUrl: './manter-centro-custo.component.html',
  styleUrls: ['./manter-centro-custo.component.scss'],
})
export class ManterCentroCustoComponent extends Unsubscriber implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  idCentroCusto: number;
  form: FormGroup;
  Situacao = Situacao;

  centrosCusto: Array<CentroCusto>;
  centroDefault: CentroCusto;

  usuarios: Array<Usuario>;
  usuarioAtual: Usuario;

  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAlcadaAprovacaoEnum = TipoAlcadaAprovacao;

  // #region Alçadas
  exibirAlcadas: boolean;
  private paramsSub: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private centroCustoService: CentroCustoService,
    private usuarioService: UsuarioService,
    private authService: AutenticacaoService,
  ) { super(); }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    try {
      this.centrosCusto = await this.obterCentrosCusto();
      this.usuarios = await this.obterOpcoesUsuarioResponsavel();
      this.usuarioAtual = this.authService.usuario();
      this.obterParametros();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  ngOnDestroy() {
    if (this.paramsSub) { this.paramsSub.unsubscribe(); }
  }

  async salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (await this.formularioValido()) {
      const centro: CentroCusto = this.form.value;
      if (this.idCentroCusto) {
        this.alterar(centro);
      } else {
        this.inserir(centro);
      }
    }
  }

  cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  naoExistemContasDisponiveis(event) {
    this.toastr.warning(this.translationLibrary.translations.ALERTS.NO_ITEMS_AVAILABLE);
  }

  onDefaultChange(event: any) {
    if (!event.target.checked) {
      this.form.patchValue({ codigoDefault: false });
    } else if (event.target.checked) {
      this.form.patchValue({ codigoDefault: true });
    }
  }

  permitirExibirAlcadas() {
    if (!this.exibirAlcadas) {
      this.exibirAlcadas = true;
    }
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe(
      (params) => {
        this.idCentroCusto = params['idCentroCusto'];

        if (this.idCentroCusto) {
          this.obterCentroCusto();
        } else {
          this.blockUI.stop();
        }
      },
    );
  }

  private obterCentroCusto() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.centroCustoService.obterPorId(this.idCentroCusto).pipe(takeUntil(this.unsubscribe)).subscribe(
      (response) => {
        if (response) {
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idCentroCusto: [0],
      idTenant: [0],
      idCentroCustoPai: [null],
      idUsuarioResponsavel: [null, Validators.required],
      situacao: [Situacao.Ativo],
      codigo: [''],
      descricao: ['', Validators.required],
      codigoDefault: [false],
    });
  }

  private preencherFormulario(centro: CentroCusto) {
    this.form.patchValue(centro);
  }

  private async formularioValido(): Promise<boolean> {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
      return false;
    }
    if (this.idCentroCusto && this.idCentroCusto === this.form.value.idCentroCustoPai) {
      this.toastr.warning('Você selecionou centro de custo pai inválido, por favor selecione outro!');
      this.blockUI.stop();
      return false;
    }

    this.centroDefault = await this.obterCentroCustoPadrao();
    if (this.form.value.codigoDefault && this.centroDefault && this.centroDefault.idCentroCusto !== this.idCentroCusto) {
      this.toastr.warning(`Já existe outro Centro de Custo marcado como padrão. Acesse o cadastro do ${this.centroDefault.descricao} para desmarca-lo.`);
      this.blockUI.stop();
      return false;
    }

    return true;
  }

  private inserir(centro: CentroCusto) {
    this.centroCustoService.inserir(centro).pipe(takeUntil(this.unsubscribe)).subscribe(
      (response) => {
        if (response) {
          this.router.navigate(['/centros-custo/', response.idCentroCusto]);
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private alterar(centro: CentroCusto) {
    this.centroCustoService.alterar(centro).pipe(takeUntil(this.unsubscribe)).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private async obterCentrosCusto(): Promise<Array<CentroCusto>> {
    return this.centroCustoService.listar().toPromise();
  }

  private async obterCentroCustoPadrao(): Promise<CentroCusto> {
    return this.centroCustoService.obterCentroCustoPadrao().toPromise();
  }

  private async obterOpcoesUsuarioResponsavel(): Promise<Array<Usuario>> {
    return this.usuarioService.obterOpcoesResponsaveisCentroCusto().toPromise();
  }
  // #endregion
}
