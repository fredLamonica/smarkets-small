import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CategoriaProduto,
  PessoaJuridica,
  RelatorioSolicitacaoCompraFiltro,
  SituacaoSolicitacaoItemCompra
} from '@shared/models';
import { TipoDataRelatorioSolicitacao } from '@shared/models/enums/tipo-data-relatorio-solicitacao';
import {
  ArquivoService,
  AutenticacaoService,
  CategoriaProdutoService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { RelatoriosService } from '@shared/providers/relatorios.service';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-relatorio-solicitacao-compra',
  templateUrl: './relatorio-solicitacao-compra.component.html',
  styleUrls: ['./relatorio-solicitacao-compra.component.scss']
})
export class RelatorioSolicitacaoCompraComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public filiaisLoading = false;
  public empresasLoading = false;
  public categoriasLoading = false;

  public filiais: Array<PessoaJuridica>;
  public empresas: Array<PessoaJuridica>;
  public categorias: Array<CategoriaProduto>;
  public filiais$: Observable<Array<PessoaJuridica>>;
  public empresas$: Observable<Array<PessoaJuridica>>;
  public categorias$: Observable<Array<CategoriaProduto>>;
  public usaIntegracao: boolean;
  public formFiltro: FormGroup;
  public tiposDataRelatorioSolicitacao = TipoDataRelatorioSolicitacao;
  public opcoesTipoDataFiltro: any[];

  public enumSituacaoSolicitacaoItemCompra = SituacaoSolicitacaoItemCompra;
  public opcoesSituacaoSolicitacaoItemCompra: any[];

  private isTenantSmarkets: boolean;
  public get tenantSmarkets() {
    return this.isTenantSmarkets;
  }

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private pessoaJuridicaService: PessoaJuridicaService,
    private authService: AutenticacaoService,
    private categoriaProdutoService: CategoriaProdutoService,
    private relatorioService: RelatoriosService,
    private arquivoService: ArquivoService
  ) {
    this.opcoesSituacaoSolicitacaoItemCompra = Object.keys(
      this.enumSituacaoSolicitacaoItemCompra
    ).filter(Number);
  }

  ngOnInit() {
    this.isTenantSmarkets = this.authService.usuario().permissaoAtual.idTenant == 1;
    this.opcoesTipoDataFiltro = Object.keys(this.tiposDataRelatorioSolicitacao).filter(Number);
    this.construirFormularioFiltro();
    this.usaIntegracao =
      this.authService.usuario().permissaoAtual.pessoaJuridica.utilizaSolicitacaoCompra;
    this.subListas();
  }

  private construirFormularioFiltro() {
    this.formFiltro = this.fb.group({
      centros: [new Array<PessoaJuridica>()],
      categorias: [new Array<CategoriaProduto>()],
      idsTenants: [new Array<PessoaJuridica>()],
      tipoDataRelatorio: [TipoDataRelatorioSolicitacao['Data de importação da solicitação']],
      dataInicio: [moment().add('months', -1).startOf('month').format('YYYY-MM-DD')],
      dataFim: [moment().add('months', -1).endOf('month').format('YYYY-MM-DD')],
      situacaoSolicitacaoItemCompras: [new Array<SituacaoSolicitacaoItemCompra>()]
    });
  }

  private subListas() {
    this.subEmpresas();
    this.subFiliais();
    this.subCategorias();
  }

  private subEmpresas() {
    this.empresasLoading = true;
    this.empresas$ = this.pessoaJuridicaService.listarCompradores_E_IntegracaoSap(true).pipe(
      catchError(() => of([])),
      tap(pessoasJuridicas => {
        this.empresas = pessoasJuridicas;
        this.empresasLoading = false;
      }),
      shareReplay()
    );
  }

  private subFiliais() {
    this.filiaisLoading = true;
    this.filiais$ = this.pessoaJuridicaService.ObterFiliais().pipe(
      catchError(() => of([])),
      tap(filiais => {
        this.filiais = filiais.filter(
          filial => filial.codigoFilialEmpresa != null && filial.codigoFilialEmpresa.trim() != ''
        );
        this.filiais$ = Observable.of(this.filiais);
        this.filiaisLoading = false;
      }),
      shareReplay()
    );
  }

  private subCategorias() {
    this.categoriasLoading = true;
    this.categorias$ = this.categoriaProdutoService.listarAtivas().pipe(
      catchError(() => of([])),
      tap(categoriasProduto => {
        this.categorias = categoriasProduto;
        this.categoriasLoading = false;
      }),
      shareReplay()
    );
  }

  public downloadRelatorioPedidosCotacao() {
    if (this.validarFiltro()) {
      this.blockUI.start();
      // let data = this.datePipe.transform(this.dataInicio, 'MM-yyyy');
      let filtro: RelatorioSolicitacaoCompraFiltro = this.formFiltro.value;
      this.relatorioService.obterRelatorioSolicitacaoCompra(filtro).subscribe(
        response => {
          if (response.size > 0) {
            this.arquivoService.createDownloadElement(
              response,
              `Relatório de solicitação de compra ${filtro.dataInicio} a ${filtro.dataFim}.xls`
            );
            this.blockUI.stop();
          } else {
            this.toastr.warning('Nenhum registro encontrado.');
            this.blockUI.stop();
          }
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }

  private validarFiltro(): boolean {
    let filtro = this.formFiltro.value;

    if (filtro.tipoDataRelatorio == null || filtro.tipoDataRelatorio.toString() == '') {
      this.toastr.warning('Selecione uma competência de data para o filtro');
      return false;
    }

    if (filtro.dataInicio == null || filtro.dataInicio.toString() == '') {
      this.toastr.warning('Data Inicio do filtro não pode ser vazia');
      return false;
    }
    if (filtro.dataFim == null || filtro.dataFim.toString() == '') {
      this.toastr.warning('Data Fim do filtro não pode ser vazia');
      return false;
    }

    if (filtro.dataInicio > filtro.dataFim) {
      this.toastr.warning('Data de Inicio do filtro não pode ser maior que Data do Fim');
      return false;
    }

    return true;
  }

  public customSearchUnidadeCompradora(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.razaoSocial.toLocaleLowerCase().indexOf(term) > -1;
  }

  public customSearchFilial(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.codigoFilialEmpresa.toLocaleLowerCase().indexOf(term) > -1;
  }

  public customSearchCategoria(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.nome.toLocaleLowerCase().indexOf(term) > -1;
  }

  public customSearchCompetencia(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return TipoDataRelatorioSolicitacao[item].toLocaleLowerCase().indexOf(term) > -1;
  }
}
