import { Component, OnInit } from '@angular/core';
import { Cotacao, Ordenacao, PerfilUsuario, SituacaoCotacao } from '@shared/models';
import {
  AutenticacaoService, CotacaoService, LocalStorageService, TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CotacaoAvancadoFiltro } from '../../../shared/models/fltros/cotacao-avancado-filtro';
import { CotacaoSimplesFiltro } from '../../../shared/models/fltros/cotacao-simples-filtro';
import { Acompanhamento } from './../acompanhamento';

@Component({
  selector: 'acompanhamento-cotacao',
  templateUrl: './acompanhamento-cotacao.component.html',
  styleUrls: ['./acompanhamento-cotacao.component.scss'],
})
export class AcompanhamentoCotacaoComponent implements OnInit, Acompanhamento {

  get getPerfilUsuarioLogado() {
    return this.perfilUsuarioLogado;
  }
  get envelopeFechadoHabilitado() {
    return this._envelopeFechadoHabilitado;
  }
  @BlockUI() blockUI: NgBlockUI;

  flagPermitirExibirSla: boolean = false;
  SituacaoCotacao = SituacaoCotacao;

  cotacoes: Array<Cotacao>;
  cotacao: Cotacao;

  cotacaoSimplesFiltro: CotacaoSimplesFiltro = new CotacaoSimplesFiltro();
  cotacaoAvancadoFiltro: CotacaoAvancadoFiltro = new CotacaoAvancadoFiltro();
  ordenacao: Ordenacao = Ordenacao.DESC;
  itemOrdenar: string = 'c.IdCotacao';
  itensPorPagina: number = 16;
  PerfilUsuario = PerfilUsuario;
  private totalPaginas: number;
  private pagina: number;
  private perfilUsuarioLogado: PerfilUsuario;

  private _envelopeFechadoHabilitado: boolean = false;

  private filtroCotacao = 'filtroCotacao';

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cotacaoService: CotacaoService,
    private authService: AutenticacaoService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this._envelopeFechadoHabilitado = this.authService.usuario().permissaoAtual.pessoaJuridica.habilitarEnvelopeFechado;
    this.flagPermitirExibirSla = this.permitirExibirSla();
    this.perfilUsuarioLogado = this.authService.perfil();
    this.resetPaginacao();
    this.listarCotacoes();
  }

  resetPaginacao() {
    this.cotacoes = new Array<Cotacao>();
    this.pagina = 1;
  }

  onScroll(termo: string = '', parametrosFiltroAvancado: any[] = null, objetoFiltro = null) {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      if (objetoFiltro != null) {
        this.obterFiltroAvancado(null, objetoFiltro);
      } else { this.obter(termo); }
    }
  }

  obterFiltroAvancado(parametrosFiltroAvancado: any[], objetoFiltro?: any) {

    this.cotacaoAvancadoFiltro.itemOrdenar = this.itemOrdenar;
    this.cotacaoAvancadoFiltro.ordenacao = this.ordenacao;
    this.cotacaoAvancadoFiltro.itensPorPagina = this.itensPorPagina;
    this.cotacaoAvancadoFiltro.pagina = this.pagina;
    this.cotacaoAvancadoFiltro.idCotacao = objetoFiltro.idCotacao ? objetoFiltro.idCotacao : null;
    this.cotacaoAvancadoFiltro.termoCompradorResponsavel = objetoFiltro.termoCompradorResponsavel ? objetoFiltro.termoCompradorResponsavel : null;
    this.cotacaoAvancadoFiltro.termoDescricaoCotacao = objetoFiltro.termoDescricaoCotacao ? objetoFiltro.termoDescricaoCotacao : null;
    this.cotacaoAvancadoFiltro.termoStatus = objetoFiltro.termoStatus ? objetoFiltro.termoStatus : null;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService
      .obterFiltroAvancado(
        this.cotacaoAvancadoFiltro,
      )
      .subscribe(
        (response) => {
          if (response) {
            this.cotacoes = this.cotacoes.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.cotacoes = new Array<Cotacao>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  obter(termo: string = '') {

    this.cotacaoSimplesFiltro.itemOrdenar = this.itemOrdenar;
    this.cotacaoSimplesFiltro.itensPorPagina = this.itensPorPagina;
    this.cotacaoSimplesFiltro.ordenacao = this.ordenacao;
    this.cotacaoSimplesFiltro.pagina = this.pagina;
    this.cotacaoSimplesFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService.obter(this.cotacaoSimplesFiltro).subscribe(
      (response) => {
        if (response) {
          this.cotacoes = this.cotacoes.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.cotacoes = new Array<Cotacao>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private listarCotacoes() {
    const filtroCotacao = this.localStorageService.getObject(this.filtroCotacao);
    if (filtroCotacao) {
      this.obterFiltroAvancado(null, filtroCotacao);
    } else {
      this.obter();
    }
  }

  private permitirExibirSla() {
    if (this.authService.perfil() !== PerfilUsuario.Fornecedor) { return true; }

    return false;
  }
}
