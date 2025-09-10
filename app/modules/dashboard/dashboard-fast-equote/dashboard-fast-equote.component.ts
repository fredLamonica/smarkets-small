import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { PessoaJuridica } from '../../../shared/models';
import { PeriodoFiltroDashboard } from '../../../shared/models/enums/periodo-filtro-dashboard';
import { TipoRelatorioDashboard } from '../../../shared/models/enums/tipo-relatorio-dashboard';
import { IndicadorFornecedorFast } from '../../../shared/models/indicador/indicador-fornecedor-fast';
import { IndicadorGmvFast } from '../../../shared/models/indicador/indicador-gmv-fast';
import { IndicadorTransacoesSkuFast } from '../../../shared/models/indicador/indicador-transacoes-sku-fast';
import { IndicadorUsuarioFast } from '../../../shared/models/indicador/indicador-usuario-fast';
import { EnumToArrayPipe } from '../../../shared/pipes';
import { ArquivoService, TranslationLibraryService } from '../../../shared/providers';
import { IndicadorService } from '../../../shared/providers/indicador.service';
import { IndicadorCategoriaDto } from './../../../shared/models/indicador/indicador-categoria-dto';

@Component({
  selector: 'smk-dashboard-fast-equote',
  templateUrl: './dashboard-fast-equote.component.html',
  styleUrls: ['./dashboard-fast-equote.component.scss']
})
export class DashboardFastEquoteComponent extends Unsubscriber implements OnInit {

@BlockUI() blockUI: NgBlockUI;

  IndicadorGmvFast: IndicadorGmvFast;
  IndicadorUsuarioFast: IndicadorUsuarioFast;
  IndicadorFornecedorFast: IndicadorFornecedorFast;
  IndicadorTransacoesSkuFast: IndicadorTransacoesSkuFast;
  IndicadorCategoriaDto: IndicadorCategoriaDto;
  Comprador: Array<PessoaJuridica>;
  opcoesPeriodo: Array<{ index: number, name: string }>;
  opcoesRelatorio: Array<{ index: number, name: string }>;
  form: FormGroup;
  isLoadingGmv: boolean = true;
  isLoadingForn: boolean = true;
  isLoadingUser: boolean = true;
  isLoadingTrans: boolean = true;
  isLoadingTransCateg: boolean = true;


  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private indicadorService: IndicadorService,
    private formBuilder: FormBuilder,
    private arquivoService: ArquivoService,
    ) {
      super();
    }

  ngOnInit() {
    this.construirDashboard();
  }

  private construirDashboard(){
    this.construirFormulario();
    this.construirFiltro();
    this.obterIndicadores();
  }

  LoadingGraficos(){
    this.isLoadingGmv = true;
    this.isLoadingForn = true;
    this.isLoadingUser = true;
    this.isLoadingTrans = true;
    this.isLoadingTransCateg = true;
  }

  obterIndicadores(){
    this.LoadingGraficos()
    this.obtenhaGmv();
    this.obtenhaUsuarios();
    this.obtenhaFornecedor();
    this.obtenhaTransacoesSKU();
    this.obtenhaCategoriasSkU()
  }

   private construirFiltro() {
    this.opcoesPeriodo = new EnumToArrayPipe().transform(PeriodoFiltroDashboard) as Array<any>;
    this.opcoesRelatorio = new EnumToArrayPipe().transform(TipoRelatorioDashboard) as Array<any>;

    this.obtenhaCompradorIndicadorFast()
  }

  private construirFormulario(){
    const idTenantSmarkets = 1;

    this.form = this.formBuilder.group({
      periodo: [PeriodoFiltroDashboard.Semana],
      cliente: [idTenantSmarkets],
      relatorio: [TipoRelatorioDashboard.Gmvs],
    })
  }

  private obtenhaGmv(){
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.indicadorService.obterGmvfast(this.form.value.periodo).subscribe(
        response => {
          this.IndicadorGmvFast = response;
          this.isLoadingGmv = false;
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }

  private obtenhaUsuarios(){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
     this.indicadorService.obterUsuarioFast(this.form.value.periodo).subscribe(
        response => {
          this.IndicadorUsuarioFast = response;
          this.isLoadingUser = false;
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  private obtenhaFornecedor(){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
     this.indicadorService.obterFornecedorFast(this.form.value.periodo).subscribe(
        response => {
          this.IndicadorFornecedorFast = response;
          this.isLoadingForn = false;
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  private obtenhaTransacoesSKU(){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.indicadorService.obterTransacoesSKUFast(this.form.value.periodo).subscribe(
        response => {
          this.IndicadorTransacoesSkuFast = response;
          this.isLoadingTrans = false;
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
    );
  }

  obtenhaCategoriasSkU(){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.indicadorService.obterCategoriasSkU(this.form.value.cliente).subscribe(
        response => {
          this.IndicadorCategoriaDto = response;
          this.isLoadingTransCateg = false;
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
    );
  }

  private obtenhaCompradorIndicadorFast(){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.indicadorService.obterCompradorIndicadorFast().subscribe(
        response => {
          this.Comprador = response;
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
    );
  }

  obtenhaRelatorioCategorias(){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.indicadorService.obterRelatorioCategorias().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop())).subscribe(
        response => {
          this.arquivoService.createDownloadElement(
            response,
            `Relatório de Categoria de Empresa.xls`,
          );
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
    );
  }
  obtenhaRelatorios(){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.indicadorService.obtenhaRelatorio(this.form.value.relatorio, this.form.value.periodo).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop())).subscribe(
        response => {
          this.arquivoService.createDownloadElement(
            response,
            this.nomenclaturaRelatorio()
          );
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
    );
  }
  private nomenclaturaRelatorio(){
    switch(this.form.value.relatorio){
        case 1:
          return `Relatório de gmvs.xls`
        case 2:
          return `Relatório de usuários.xls`
        case 3:
          return `Relatório de Fornecedores.xls`
        case 4:
          return `Relatório de Transações.xls`
    }
  }
}
