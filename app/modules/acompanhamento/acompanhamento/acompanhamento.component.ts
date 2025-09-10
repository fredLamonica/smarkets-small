import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CotacaoFiltro, PerfilUsuario, SituacaoCotacao, SituacaoPedido, SituacaoSolicitacaoItemCompra, Usuario } from '@shared/models';
import { SituacaoSolicitacaoCompra } from '@shared/models/enums/situacao-solicitacao-compra';
import { AcompanhamentoFiltro, AcompanhamentoFiltroEtapa } from '@shared/models/fltros/acompanhamento-filtro';
import { SolicitacaoCompraFiltro } from '@shared/models/fltros/solicitacao-compra-filtro';
import { AutenticacaoService, LocalStorageService } from '@shared/providers';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { Acompanhamento } from '../acompanhamento';
import { AcompanhamentoCotacaoComponent } from '../acompanhamento-cotacao/acompanhamento-cotacao.component';
import { AcompanhamentoPedidoComponent } from '../acompanhamento-pedido/acompanhamento-pedido.component';
import { AcompanhamentoSolicitacaoCompraComponent } from '../acompanhamento-solicitacao-compra/acompanhamento-solicitacao-compra.component';
import { AcompanhamentosComponent } from '../acompanhamentos/acompanhamentos.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-acompanhamento',
  templateUrl: './acompanhamento.component.html',
  styleUrls: ['./acompanhamento.component.scss'],
})
export class AcompanhamentoComponent extends Unsubscriber implements OnInit {

  get acompanhamento(): Acompanhamento {
    switch (this.tabAtiva) {
      case 'solicitacoes-compra': {
        return this.acompanhamentoSolicitacaoCompra;
      }
      case 'pedidos': {
        return this.acompanhamentoPedidos;
      }
      case 'cotacoes': {
        return this.acompanhamentoCotacao;
      }
      case 'acompanhamentos': {
        return this.acompanhamentos;
      }
    }
  }
  @ViewChild('acompanhamentoSolicitacaoCompra') acompanhamentoSolicitacaoCompra: AcompanhamentoSolicitacaoCompraComponent;
  @ViewChild('acompanhamentoCotacao') acompanhamentoCotacao: AcompanhamentoCotacaoComponent;
  @ViewChild('acompanhamentoPedido') acompanhamentoPedidos: AcompanhamentoPedidoComponent;
  @ViewChild('acompanhamentos') acompanhamentos: AcompanhamentosComponent;

  tabAtiva: 'acompanhamentos' | 'solicitacoes-compra' | 'pedidos' | 'requisicoes' | 'cotacoes' = 'solicitacoes-compra';

  usuarioAtual: Usuario;
  PerfilUsuario = PerfilUsuario;
  formSol: FormGroup;
  formCot: FormGroup;
  formAcomp: FormGroup;

  filtroAvancado: boolean = false;
  SituacaoSolicitacaoCompra = SituacaoSolicitacaoCompra;
  enumStatusCotacao = SituacaoCotacao;
  opcoesStatusCotacao = new Array<string>();
  enumSituacaoSolicitacaoItemCompra = SituacaoSolicitacaoItemCompra;
  opcoesSituacaoSolicitacaoItemCompra: any[];
  flagExibirAcompanhamentoSolicitacoesCompra: boolean = false;
  flagExibirAcompanhamentoCotacoes: boolean = false;
  flagExibirAcompanhamentos: boolean = false;

  situacaoPedido = SituacaoPedido;

  jaFezBuscaAvancada: boolean = false;

  acompanhamentoFiltroEtapa: AcompanhamentoFiltroEtapa = new AcompanhamentoFiltroEtapa();
  enumSituacaoAtual: any;

  integracaoSapHabilitada: boolean;
  integracaoErpHabilitada: boolean;

  // #region buscaAvancada

  buscaAvancada: 'acompanhamentos' | 'solicitacoes-compra' | 'pedidos' | 'requisicoes' | 'cotacoes' = 'acompanhamentos';

  maskValor = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 4,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 12,
  });

  private termo: string = '';

  private queryParamsSub: Subscription;

  private filtroCotacao = 'filtroCotacao';
  private filtroRequisicao = 'filtroRequisicao';
  private filtroSolicitacaoCompra = 'filtroSolicitacaoCompra';
  private filtroAcompanhamento = 'filtroAcompanhamento';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AutenticacaoService,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
  ) {
    super();
    this.opcoesStatusCotacao.push(
      'Em configuração',
      'Agendada',
      'Em andamento',
      'Em análise',
      'Encerrada',
      'Cancelada',
    );

    this.opcoesSituacaoSolicitacaoItemCompra = Object.keys(
      this.enumSituacaoSolicitacaoItemCompra,
    ).filter(Number);
  }

  ngOnInit() {
    this.usuarioAtual = this.authService.usuario();
    this.flagExibirAcompanhamentoSolicitacoesCompra = this.exibirAcompanhamentoSolicitacoesCompra();
    this.flagExibirAcompanhamentoCotacoes = this.exibirAcompanhamentoCotacoes();
    this.flagExibirAcompanhamentos = this.exibirAcompanhamentos();

    if (this.PerfilUsuario.Fornecedor === this.usuarioAtual.permissaoAtual.perfil) {
      this.opcoesStatusCotacao = this.opcoesStatusCotacao.filter(
        (p) => p !== 'Em configuração' && p !== 'Agendada',
      );
    }

    this.tabAtiva = this.tabInicioPerfil();

    this.queryParamsSub = this.route.queryParams.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => this.selectTab(params['aba']));

    this.construirFormularioBusca();
    this.montarSessionStorageFiltro();

    this.integracaoSapHabilitada = this.authService.usuario().permissaoAtual.pessoaJuridica.integracaoSapHabilitada;
    this.integracaoErpHabilitada = this.authService.usuario().permissaoAtual.pessoaJuridica.habilitarIntegracaoERP;
  }

  selectTab(aba: 'acompanhamentos' | 'solicitacoes-compra' | 'pedidos' | 'cotacoes') {
    if (aba) {
      this.tabAtiva = aba;
      this.montarSessionStorageFiltro();
    }
  }

  tabInicioPerfil(): 'acompanhamentos' | 'solicitacoes-compra' | 'pedidos' | 'requisicoes' | 'cotacoes' {
    switch (this.usuarioAtual.permissaoAtual.perfil) {
      case PerfilUsuario.Fornecedor:
        return 'cotacoes';

      case PerfilUsuario.Aprovador:
        return 'requisicoes';
        break;

      default: {
        if (this.usuarioAtual.permissaoAtual.pessoaJuridica.utilizaSolicitacaoCompra) {
          return 'acompanhamentos';
        } else {
          return 'requisicoes';
        }
      }
    }
  }

  construirFormularioBusca() {
    this.formSol = this.fb.group({
      termoCategoriaSolicitacao: [''],
      termoGrupoCompradores: [''],
      termoTipoRC: [''],
      termoCodigoRCSolicitacao: [''],
      termoSituacaoSolicitacao: [''],
      termoRequisitante: [''],
      termoDescricaoSolicitacao: [''],
      dataInicial: [''],
      dataFinal: [''],
      termoCategoriaDemanda: [''],
      termoCodigoFilialEmpresa: [''],
      tipoDocumento: [''],
      termoComprador: [''],
    });

    this.formCot = this.fb.group({
      idCotacao: [''],
      termoDescricaoCotacao: [''],
      termoCompradorResponsavel: [''],
      termoStatus: [''],
    });

    this.formAcomp = this.fb.group({
      idPedido: [''],
      termoStatus: [''],
      termoNumeroRc: [''],
      termoNumeroPedido: [''],
      termoNomeFornecedor: [''],
      termoCodigoFornecedorSap: [''],
      termoCodigoPedidoSap: [''],
      termoComprador: [''],
      termoOrigem: [''],
      termoValorMenor: [''],
      termoValorMaior: [''],
      termoCodigoFilialEmpresa: [''],
      termoDataCriacao: [''],
      termoDataLiberacao: [''],
      termoEtapa: [''],
      termoSituacaoEtapa: [{ value: null, disabled: true }],
      termoCompradorSc: [''],
    });
  }

  buscar(termo) {
    this.removerSessionStorage();
    this.termo = termo;
    this.acompanhamento.resetPaginacao();
    this.acompanhamento.obter(this.termo);
  }

  buscarFiltroAvancado(onScroll: boolean = false) {
    let parametrosFiltroAvancado = [];
    let parametrosFiltroAvancadoSemNull = [];
    let objetoFiltro;

    if (this.tabAtiva === 'solicitacoes-compra') {
      parametrosFiltroAvancado = this.buscarFiltroAvancadoSolicitacaoCompra();
    } else if (this.tabAtiva === 'cotacoes') {
      parametrosFiltroAvancado = this.buscarFiltroAvancadoCotacao();
    } else if (this.tabAtiva === 'acompanhamentos') {
      parametrosFiltroAvancado = this.buscarFiltroAvancadoAcompanhamentos();
    }

    parametrosFiltroAvancadoSemNull =
      this.removerParametrosFiltroAvancadoComNull(parametrosFiltroAvancado);

    // Region Filtros na Session Storage
    objetoFiltro = this.sessionStorageFiltro(parametrosFiltroAvancadoSemNull);
    // END Region Filtros na Session Storage

    if (!onScroll) {
      this.acompanhamento.resetPaginacao();
      this.acompanhamento.obterFiltroAvancado(parametrosFiltroAvancadoSemNull, objetoFiltro);
    } else {
      this.acompanhamento.onScroll('', parametrosFiltroAvancadoSemNull, objetoFiltro);
    }
  }

  removerMascara(valor) {
    return Number(valor.toString().replace(/\./g, '').replace(',', '.'));
  }

  onScroll() {
    if (this.buscaAvancada !== null) { this.buscarFiltroAvancado(true); } else { this.acompanhamento.onScroll(this.termo); }
  }

  limparFiltro() {
    this.termo = '';
    this.acompanhamento.resetPaginacao();
    this.acompanhamento.obter();
  }

  exibirAcompanhamentoSolicitacoesCompra(): boolean {
    if (this.usuarioAtual) {
      return (
        ![PerfilUsuario.Fornecedor, PerfilUsuario.Aprovador].includes(
          this.usuarioAtual.permissaoAtual.perfil,
        ) && this.usuarioAtual.permissaoAtual.pessoaJuridica.utilizaSolicitacaoCompra
      );
    }

    return false;
  }

  exibirAcompanhamentos(): boolean {
    if (this.usuarioAtual) {
      return (
        ![PerfilUsuario.Fornecedor, PerfilUsuario.Aprovador].includes(
          this.usuarioAtual.permissaoAtual.perfil,
        ) && this.usuarioAtual.permissaoAtual.pessoaJuridica.utilizaSolicitacaoCompra
      );
    }

    return false;
  }

  exibirAcompanhamentoRequisicoes(): boolean {
    if (this.usuarioAtual) {
      return (
        this.usuarioAtual.permissaoAtual.perfil !== PerfilUsuario.Fornecedor &&
        this.usuarioAtual.permissaoAtual.pessoaJuridica.habilitarModuloCotacao
      );
    }

    return false;
  }

  exibirAcompanhamentoCotacoes(): boolean {
    if (this.usuarioAtual) {
      return (
        ![PerfilUsuario.Requisitante, PerfilUsuario.Aprovador].includes(
          this.usuarioAtual.permissaoAtual.perfil,
        ) && this.usuarioAtual.permissaoAtual.pessoaJuridica.habilitarModuloCotacao
      );
    }

    return false;
  }

  habilitarFiltroAvancado() {
    this.filtroAvancado = !this.filtroAvancado;
  }

  isNullOrWhitespace(input) {
    return !input || !input.toString().trim();
  }

  exibirBuscaAvancada(event) {
    if (event) {
      this.buscaAvancada = this.tabAtiva;
    } else if (this.tabAtiva !== 'acompanhamentos') {
      this.buscaAvancada = null;
    }
  }

  etapaAlterada(value) {
    this.enumSituacaoAtual = null;

    this.formAcomp.controls.termoSituacaoEtapa.patchValue(null);
    this.formAcomp.controls.termoSituacaoEtapa.disable();

    if (!isNaN(value)) {
      this.formAcomp.controls.termoSituacaoEtapa.enable();
      const etapaAtual = this.acompanhamentoFiltroEtapa.etapas.find((p) => p.value === value);

      this.enumSituacaoAtual = etapaAtual.enum;
    }
  }

  private montarSessionStorageFiltro() {
    if (this.tabAtiva === 'solicitacoes-compra') {
      const filtroSolicitacaoCompra = this.localStorageService.getObject(
        this.filtroSolicitacaoCompra,
      );
      if (filtroSolicitacaoCompra) {
        this.formSol.patchValue(filtroSolicitacaoCompra);
        this.buscaAvancada = this.tabAtiva;
      }
    } else if (this.tabAtiva === 'cotacoes') {
      const filtroCotacao = this.localStorageService.getObject(this.filtroCotacao);
      if (filtroCotacao) {
        this.formCot.patchValue(filtroCotacao);
        this.buscaAvancada = this.tabAtiva;
      }
    } else if (this.tabAtiva === 'acompanhamentos') {
      const filtroAcompanhamento = this.localStorageService.getObject(this.filtroAcompanhamento);

      if (filtroAcompanhamento) {
        this.formAcomp.patchValue(filtroAcompanhamento);
        this.buscaAvancada = this.tabAtiva;

        if (filtroAcompanhamento.termoEtapa) {
          this.etapaAlterada(filtroAcompanhamento.termoEtapa);
        }

        if (filtroAcompanhamento.termoSituacaoEtapa) {
          this.formAcomp.controls.termoSituacaoEtapa.enable();
          this.formAcomp.controls.termoSituacaoEtapa.patchValue(
            filtroAcompanhamento.termoSituacaoEtapa,
          );
        }
      }
    }
  }

  private removerSessionStorage() {
    this.localStorageService.remove(this.filtroCotacao);
    this.localStorageService.remove(this.filtroRequisicao);
    this.localStorageService.remove(this.filtroSolicitacaoCompra);
    this.localStorageService.remove(this.filtroAcompanhamento);
  }

  private buscarFiltroAvancadoSolicitacaoCompra(parametrosFiltroAvancado = []) {
    parametrosFiltroAvancado.push(
      this.formSol.value.termoCategoriaSolicitacao ? this.formSol.value.termoCategoriaSolicitacao : '',
    );
    parametrosFiltroAvancado.push(
      this.formSol.value.termoGrupoCompradores ? this.formSol.value.termoGrupoCompradores : '',
    );
    parametrosFiltroAvancado.push(
      this.formSol.value.termoTipoRC ? this.formSol.value.termoTipoRC : '',
    );
    parametrosFiltroAvancado.push(
      this.formSol.value.termoCodigoRCSolicitacao ? this.formSol.value.termoCodigoRCSolicitacao : '',
    );
    parametrosFiltroAvancado.push(
      this.formSol.value.termoSituacaoSolicitacao ? this.formSol.value.termoSituacaoSolicitacao : '',
    );
    parametrosFiltroAvancado.push(
      this.formSol.value.termoRequisitante ? this.formSol.value.termoRequisitante : '',
    );
    parametrosFiltroAvancado.push(
      this.formSol.value.termoDescricaoSolicitacao ? this.formSol.value.termoDescricaoSolicitacao : '',
    );
    parametrosFiltroAvancado.push(
      this.formSol.value.dataInicial ? this.formSol.value.dataInicial : '',
    );
    parametrosFiltroAvancado.push(this.formSol.value.dataFinal ? this.formSol.value.dataFinal : '');
    parametrosFiltroAvancado.push(
      this.formSol.value.termoCategoriaDemanda ? this.formSol.value.termoCategoriaDemanda : '',
    );
    parametrosFiltroAvancado.push(
      this.formSol.value.termoCodigoFilialEmpresa ? this.formSol.value.termoCodigoFilialEmpresa : '',
    );
    parametrosFiltroAvancado.push(
      this.formSol.value.tipoDocumento ? this.formSol.value.tipoDocumento : '',
    );
    parametrosFiltroAvancado.push(
      this.formSol.value.termoComprador ? this.formSol.value.termoComprador : '',
    );

    return parametrosFiltroAvancado;
  }

  private buscarFiltroAvancadoCotacao(parametrosFiltroAvancado = []) {
    parametrosFiltroAvancado.push(this.formCot.value.idCotacao ? this.formCot.value.idCotacao : '');
    parametrosFiltroAvancado.push(
      this.formCot.value.termoDescricaoCotacao ? this.formCot.value.termoDescricaoCotacao : '',
    );
    parametrosFiltroAvancado.push(
      this.formCot.value.termoCompradorResponsavel
        ? this.formCot.value.termoCompradorResponsavel
        : '',
    );
    parametrosFiltroAvancado.push(
      this.formCot.value.termoStatus ? this.formCot.value.termoStatus : '',
    );
    return parametrosFiltroAvancado;
  }

  private buscarFiltroAvancadoAcompanhamentos(parametrosFiltroAvancado = []) {
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoNumeroRc ? this.formAcomp.value.termoNumeroRc : '',
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoNumeroPedido ? this.formAcomp.value.termoNumeroPedido : '',
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoCodigoFilialEmpresa
        ? this.formAcomp.value.termoCodigoFilialEmpresa
        : '',
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoNomeFornecedor ? this.formAcomp.value.termoNomeFornecedor : '',
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoCodigoFornecedorSap
        ? this.formAcomp.value.termoCodigoFornecedorSap
        : '',
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoCodigoPedidoSap ? this.formAcomp.value.termoCodigoPedidoSap : '',
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoComprador ? this.formAcomp.value.termoComprador : '',
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoOrigem ? this.formAcomp.value.termoOrigem : '',
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoValorMenor
        ? this.removerMascara(this.formAcomp.value.termoValorMenor)
        : '',
    );

    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoValorMaior
        ? this.removerMascara(this.formAcomp.value.termoValorMaior)
        : '',
    );

    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoDataCriacao ? this.formAcomp.value.termoDataCriacao : '',
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoDataLiberacao ? this.formAcomp.value.termoDataLiberacao : '',
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoEtapa ? this.formAcomp.value.termoEtapa : '',
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoSituacaoEtapa ? this.formAcomp.value.termoSituacaoEtapa : null,
    );
    parametrosFiltroAvancado.push(
      this.formAcomp.value.termoCompradorSc ? this.formAcomp.value.termoCompradorSc : null,
    );
    return parametrosFiltroAvancado;
  }

  private removerParametrosFiltroAvancadoComNull(parametrosFiltroAvancado = []) {
    const parametrosFiltroAvancadoSemNull = [];
    parametrosFiltroAvancado.forEach((param) => {
      if (param === 'null') { parametrosFiltroAvancadoSemNull.push(''); } else { parametrosFiltroAvancadoSemNull.push(param); }
    });

    return parametrosFiltroAvancadoSemNull;
  }

  private sessionStorageFiltro(parametrosFiltroAvancadoSemNull = []) {
    let objetoFiltro;
    if (this.tabAtiva === 'solicitacoes-compra') {
      objetoFiltro = this.instanciarFiltroSolicitacaoCompra(parametrosFiltroAvancadoSemNull);
      const formularioSolicitacaoCompra = Object.values(this.formSol.value).some(
        (item) => !this.isNullOrWhitespace(item),
      );

      if (!formularioSolicitacaoCompra) {
        this.localStorageService.remove(this.filtroSolicitacaoCompra);
      } else {
        this.localStorageService.setObject(this.filtroSolicitacaoCompra, objetoFiltro);
      }
    } else if (this.tabAtiva === 'cotacoes') {
      objetoFiltro = this.instanciarFiltroCotacao(parametrosFiltroAvancadoSemNull);
      if (this.formularioCotacaoVazio()) {
        this.localStorageService.remove(this.filtroCotacao);
      } else {
        this.localStorageService.setObject(this.filtroCotacao, objetoFiltro);
      }
    } else if (this.tabAtiva === 'acompanhamentos') {
      objetoFiltro = this.instanciarFiltroAcompanhamento(parametrosFiltroAvancadoSemNull);

      const formularioAcompanhamento = Object.values(this.formAcomp.value).some(
        (item) => !this.isNullOrWhitespace(item),
      );

      if (!formularioAcompanhamento) {
        this.localStorageService.remove(this.filtroAcompanhamento);
      } else {
        this.localStorageService.setObject(this.filtroAcompanhamento, objetoFiltro);
      }
    }

    return objetoFiltro;
  }

  private formularioCotacaoVazio(): boolean {
    const formulario = this.formCot.getRawValue();
    if (
      this.isNullOrWhitespace(formulario.idCotacao) &&
      this.isNullOrWhitespace(formulario.termoDescricaoCotacao) &&
      this.isNullOrWhitespace(formulario.termoCompradorResponsavel) &&
      this.isNullOrWhitespace(formulario.termoStatus)
    ) {
      return true;
    }

    return false;
  }

  private instanciarFiltroCotacao(parametrosFiltroAvancado: any[]): CotacaoFiltro {
    return new CotacaoFiltro(
      parametrosFiltroAvancado[0],
      parametrosFiltroAvancado[1],
      parametrosFiltroAvancado[2],
      parametrosFiltroAvancado[3],
    );
  }

  private instanciarFiltroSolicitacaoCompra(parametrosFiltroAvancado: any[]): SolicitacaoCompraFiltro {
    return new SolicitacaoCompraFiltro(
      parametrosFiltroAvancado[0],
      parametrosFiltroAvancado[1],
      parametrosFiltroAvancado[2],
      parametrosFiltroAvancado[3],
      parametrosFiltroAvancado[4],
      parametrosFiltroAvancado[5],
      parametrosFiltroAvancado[6],
      parametrosFiltroAvancado[7],
      parametrosFiltroAvancado[8],
      parametrosFiltroAvancado[9],
      parametrosFiltroAvancado[10],
      parametrosFiltroAvancado[11],
      parametrosFiltroAvancado[12],

    );
  }

  private instanciarFiltroAcompanhamento(parametrosFiltroAvancado: any[]): AcompanhamentoFiltro {
    const acompanhamentoFiltro = new AcompanhamentoFiltro();
    acompanhamentoFiltro.construirFiltroAvancado(parametrosFiltroAvancado);

    return acompanhamentoFiltro;
  }

  private irParaAcompanhamentosDeRequisicoes(): void {
    this.router.navigate(['acompanhamentos', 'requisicoes']);
  }

  // #endregion
}
