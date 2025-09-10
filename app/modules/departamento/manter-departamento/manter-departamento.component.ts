import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Departamento, Usuario } from '@shared/models';
import { AutenticacaoService, DepartamentoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { TipoAlcadaAprovacao } from '../../../shared/models/enums/tipo-alcada-aprovacao';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-departamento',
  templateUrl: './manter-departamento.component.html',
  styleUrls: ['./manter-departamento.component.scss'],
})
export class ManterDepartamentoComponent extends Unsubscriber implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  idDepartamento: number;
  form: FormGroup;

  centrosCusto: Array<Departamento>;
  usuarioAtual: Usuario;

  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAlcadaAprovacaoEnum = TipoAlcadaAprovacao;

  // #region Níveis
  exibirNiveis: boolean;
  private paramsSub: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private departamentoService: DepartamentoService,
    private authService: AutenticacaoService,
  ) { super(); }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioAtual = this.authService.usuario();
    this.contruirFormulario();
    try {
      this.centrosCusto = await this.obterCentrosCusto();
      // this.usuarios = await this.obterUsuarios();
      this.obterParametros();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  ngOnDestroy() {
    if (this.paramsSub) { this.paramsSub.unsubscribe(); }
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formularioValido()) {
      const centro: Departamento = this.form.value;
      if (this.idDepartamento) {
        this.alterar(centro);
      } else {
        this.inserir(centro);
      }
    }
  }

  cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  // private async obterUsuarios(): Promise<Array<Usuario>> {
  //   return this.usuarioService.listarAprovadores().toPromise();
  // }

  naoExistemDepartamentosDisponiveis(event) {
    this.toastr.warning(this.translationLibrary.translations.ALERTS.NO_ITEMS_AVAILABLE);
  }

  permitirExibirNiveis() {
    if (!this.exibirNiveis) {
      this.exibirNiveis = true;
    }
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe(
      (params) => {
        this.idDepartamento = params['idDepartamento'];

        if (this.idDepartamento) {
          this.obterDepartamento();
        } else {
          this.blockUI.stop();
        }
      },
    );
  }

  private obterDepartamento() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.departamentoService.obterPorId(this.idDepartamento).pipe(takeUntil(this.unsubscribe)).subscribe(
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
      idDepartamento: [0],
      idTenant: [0],
      idDepartamentoPai: [null],
      codigo: [''],
      descricao: ['', Validators.required],
    });
  }

  private preencherFormulario(centro: Departamento) {
    this.form.patchValue(centro);
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
      return false;
    }
    if (this.idDepartamento && this.idDepartamento === this.form.value.idDepartamentoPai) {
      this.toastr.warning('Você selecionou um departamento pai inválido, por favor selecione outro!');
      this.blockUI.stop();
      return false;
    }
    return true;
  }

  private inserir(departamento: Departamento) {
    this.departamentoService.inserir(departamento).pipe(takeUntil(this.unsubscribe)).subscribe(
      (response) => {
        if (response) {
          this.router.navigate(['/departamentos/', response.idDepartamento]);
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

  private alterar(centro: Departamento) {
    this.departamentoService.alterar(centro).pipe(takeUntil(this.unsubscribe)).subscribe(
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

  private async obterCentrosCusto(): Promise<Array<Departamento>> {
    return this.departamentoService.listar().toPromise();
  }
  // #endregion

}
