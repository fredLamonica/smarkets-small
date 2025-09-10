import { EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, Type } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { CatalogoItem } from '../../../../shared/models/catalogo/catalogo-item';
import { Usuario } from '../../../../shared/models/usuario';
import { AutenticacaoService } from '../../../../shared/providers/autenticacao.service';
import { TranslationLibraryService } from '../../../../shared/providers/translation-library.service';
import { OrdenacaoMarketplace } from '../../../marketplace/models/ordenacao-marketplace';
import { ManterSolicitacaoProdutoComponent } from '../../../solicitacao-produto/manter-solicitacao-produto/manter-solicitacao-produto.component';
import { FiltroContrato } from '../../models/filtro-contrato';
import { FiltroLateralContrato } from '../../models/filtro-lateral-contrato';
import { FiltroSuperiorContrato } from '../../models/filtro-superior-contrato';
import { OrdenacaoContrato } from '../../models/ordenacao-contrato';


export abstract class AbaContratoComponent extends Unsubscriber implements OnInit, OnChanges {

  @BlockUI() blockUI: NgBlockUI;

  @Input() ativa: boolean;
  @Input() filtroSuperior: FiltroSuperiorContrato;
  @Output() triggerFocusEmpresaCompradora: EventEmitter<void> = new EventEmitter<void>();

  set filtro(value: FiltroContrato) {
    this._filtro = { ...this.filtro, ...value };
  }
  get filtro(): FiltroContrato {
    return this._filtro;
  }

  registros: Array<CatalogoItem> = new Array<CatalogoItem>();
  totalPaginas: number;
  registrosPorPagina: number = 15;
  usuarioAtual: Usuario;
  pagina: number = 1;
  isFirstLoad: boolean;
  produtosLoading: boolean;
  podeAdicionarCarrinho: boolean;

  opcoesOrdenacao: Array<OrdenacaoMarketplace>;

  protected abstract itemOrdenacaoValor: string;

  protected readonly ordenacaoPadrao: OrdenacaoMarketplace = new OrdenacaoMarketplace({ id: 0, descricao: 'Mais relevantes', itemOrdenacao: 'relevance', ordem: null });
  protected carregada: boolean;
  protected modalService: NgbModal = this.injectorEngine.get(NgbModal as Type<NgbModal>);
  protected authService: AutenticacaoService = this.injectorEngine.get(AutenticacaoService as Type<AutenticacaoService>);
  protected scrollToService: ScrollToService = this.injectorEngine.get(ScrollToService as Type<ScrollToService>);
  protected translationLibrary: TranslationLibraryService = this.injectorEngine.get(TranslationLibraryService as Type<TranslationLibraryService>);

  private _filtro: FiltroContrato = new FiltroContrato({
    ordenacao: this.ordenacaoPadrao,
    filtroSuperior: new FiltroSuperiorContrato(),
    filtroLateral: new FiltroLateralContrato(),
  });

  constructor(private injectorEngine: Injector) {
    super();
  }

  ngOnInit(): void {
    this.usuarioAtual = this.authService.usuario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filtroSuperior) {
      this.carregada = false;
      this.filtro = new FiltroContrato({ filtroSuperior: this.filtroSuperior });

      if (this.ativa) {
        this.filtrar();
        this.carregada = true;
      }
    }

    if (this.ativa && changes.ativa && !this.carregada) {
      this.filtrar();
      this.carregada = true;
    }

    if (changes.empresa) {
      if (changes.empresa.currentValue) {
        this.podeAdicionarCarrinho = true;
      }
    }
  }

  filtroChange(filtroLateral: FiltroLateralContrato): void {
    this.filtro.filtroLateral = filtroLateral;
    this.filtrar();
  }

  ordenar(ordenacao: OrdenacaoContrato): void {
    if (!this.filtro.ordenacao || this.filtro.ordenacao.id !== ordenacao.id) {
      this.filtro.ordenacao = ordenacao;
      this.filtrar();
    }
  }

  paginar(pagination: any): void {
    this.pagina = pagination.page;
    this.registrosPorPagina = pagination.recordsPerPage;

    const config: ScrollToConfigOptions = {
      target: 'marketplace-top',
      duration: 0,
    };

    this.scrollToService.scrollTo(config);
    this.obter();
  }

  solicitarCadastro(): void {
    this.blockUI.start();

    const modalRef = this.modalService.open(ManterSolicitacaoProdutoComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.result.then((result) => {
      this.blockUI.stop();
    });
  }

  protected abstract obter(): void;

  protected reset(): void {
    this.isFirstLoad = true;
    this.pagina = 1;
  }

  protected filtrar(): void {
    this.reset();
    this.obter();
  }

  protected startLoading() {
    if (this.ativa) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
    }
  }

  protected stopLoading() {
    if (this.ativa) {
      this.blockUI.stop();
    }
  }

  protected getOpcoesOrdenacao(): Array<OrdenacaoContrato> {
    const opcoesOrdenacao = new Array<OrdenacaoContrato>(
      this.ordenacaoPadrao,
      new OrdenacaoContrato({ id: 1, descricao: 'Descrição crescente', itemOrdenacao: 'pt.Descricao', ordem: 'ASC' }),
      new OrdenacaoContrato({ id: 2, descricao: 'Descrição decrescente', itemOrdenacao: 'pt.Descricao', ordem: 'DESC' }),
    );

    opcoesOrdenacao.splice(
      1,
      0,
      new OrdenacaoContrato({ id: 3, descricao: 'Menor preço', itemOrdenacao: this.itemOrdenacaoValor, ordem: 'ASC' }),
      new OrdenacaoContrato({ id: 4, descricao: 'Maior preço', itemOrdenacao: this.itemOrdenacaoValor, ordem: 'DESC' }),
    );

    return opcoesOrdenacao;
  }

}
