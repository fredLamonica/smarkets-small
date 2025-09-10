import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { PessoaJuridica } from '../../../../shared/models';
import { SituacaoPedidoItem } from '../../../../shared/models/enums/situacao-pedido-item';
import { TipoCatalogo } from '../../../../shared/models/enums/tipo-catalogo';
import { PedidoItem } from '../../../../shared/models/pedido/pedido-item';
import { EnumToArrayPipe } from '../../../../shared/pipes';
import { PessoaJuridicaService } from '../../../../shared/providers';
import { CatalogoService } from '../../../../shared/providers/catalogo.service';
import { PedidoService } from '../../../../shared/providers/pedido.service';
import { ResumoCarrinhoComponent } from '../../../container/resumo-carrinho/resumo-carrinho.component';
import { AbaMarketplaceComponent } from '../base/aba-marketplace-component';

@Component({
  selector: 'smk-aba-catalogo',
  templateUrl: './aba-catalogo.component.html',
  styleUrls: ['./aba-catalogo.component.scss'],
})
export class AbaCatalogoComponent extends AbaMarketplaceComponent implements OnInit, OnChanges {

  @Input() empresa: number;

  form: FormGroup;
  exibirFlagSapEm: boolean = false;
  exibirFlagSapEmNaoAvaliada: boolean = false;
  exibirFlagSapEntrFaturas: boolean = false;
  exibirFlagSapRevFatEm: boolean = false;
  empresas: Array<PessoaJuridica>;
  empresasLoading: boolean;
  opcoesTipoCatalogo: Array<any>;

  protected itemOrdenacaoValor: string;

  constructor(
    private injector: Injector,
    private toastr: ToastrService,
    private catalogoService: CatalogoService,
    private pedidoService: PedidoService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private formBuilder: FormBuilder,
  ) {
    super(injector);
    this.itemOrdenacaoValor = 'cci.Valor';
    this.opcoesOrdenacao = this.getOpcoesOrdenacao();
  }

  ngOnInit() {
    super.ngOnInit();
    this.opcoesTipoCatalogo = new EnumToArrayPipe().transform(TipoCatalogo) as Array<any>;
    this.construirFormulario();
    this.obterParametrosIntegracaoSapHabilitado();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (changes.empresa) {
      if (changes.empresa.currentValue !== changes.empresa.previousValue && this.form) {
        if (this.form.get('empresaCatalogo').value) {
          this.form.get('empresaCatalogo').setValue(null);
        }

        this.obterEmpresas();
      }
    }
  }

  construirFormulario() {
    this.form = this.formBuilder.group({
      empresaCatalogo: [null],
      tipoCatalogo: [null],
    });

    this.form.get('empresaCatalogo').valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((empresaCatalogo) => {
        const filtro = this.filtro;

        if (empresaCatalogo) {
          filtro.empresa = empresaCatalogo.idPessoaJuridica;
          filtro.tenant = empresaCatalogo.idTenant;
        } else {
          filtro.empresa = null;
          filtro.tenant = null;
        }

        this.filtro = filtro;

        this.filtrar();
      });

    this.form.get('tipoCatalogo').valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((tipoCatalogo) => {
        const filtro = this.filtro;
        filtro.tipoCatalogo = tipoCatalogo;
        this.filtro = filtro;
        this.filtrar();
      });
  }

  empresaSearchFn(term: string, item: PessoaJuridica) {
    term = term.toLowerCase();
    return item.razaoSocial.toLowerCase().indexOf(term) > -1 ||
      item.nomeFantasia.toLowerCase().indexOf(term) > -1 ||
      item.cnpj.toLowerCase().indexOf(term) > -1;
  }

  adicionarAoCarrinho(event) {
    this.startLoading();

    const pedidoItem = new PedidoItem(
      0,
      '',
      0,
      0,
      0,
      event.item.contratoCatalogoItem.idContratoCatalogoItem,
      event.item.contratoCatalogoItem,
      event.quantidade,
      null,
      null,
      SituacaoPedidoItem.Ativo,
      null,
      event.item.contratoCatalogoItem.valor,
      event.item.contratoCatalogoItem.valor,
      event.item.contratoCatalogoItem.valor * event.quantidade,
      event.item.contratoCatalogoItem.moeda,
      event.item.contratoCatalogoItem.idMarca,
      null,
      event.item.contratoCatalogoItem.idProduto,
      null,
      event.item.contratoCatalogoItem.idFornecedor,
      event.item.contratoCatalogoItem.garantia,
      event.item.contratoCatalogoItem.frete,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      this.usuarioAtual.permissaoAtual.pessoaJuridica.filial
        ? this.usuarioAtual.permissaoAtual.pessoaJuridica.idPessoaJuridica
        : this.empresa,
      null,
      event.item.contratoCatalogoItem.icmsAliquota,
      event.item.contratoCatalogoItem.stAliquota,
      event.item.contratoCatalogoItem.difalAliquota,
      event.item.contratoCatalogoItem.ipiAliquota,
      event.item.contratoCatalogoItem.pisAliquota,
      event.item.contratoCatalogoItem.cofinsAliquota,
    );

    pedidoItem.idUsuarioSolicitante = this.usuarioAtual.idUsuario;

    // Inicializando Propriedades SAP
    if (this.exibirFlagSapEm) {
      pedidoItem.sapEm = false;
    }

    if (this.exibirFlagSapEmNaoAvaliada) {
      pedidoItem.sapEmNaoAvaliada = false;
    }

    if (this.exibirFlagSapEntrFaturas) {
      pedidoItem.sapEntrFaturas = false;
    }

    if (this.exibirFlagSapRevFatEm) {
      pedidoItem.sapRevFatEm = false;
    }

    this.pedidoService.inserirItem(pedidoItem).pipe(
      takeUntil(this.unsubscribe), finalize(() => this.stopLoading()))
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          ResumoCarrinhoComponent.atualizarCarrinho.next();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  protected obter(): void {
    this.produtosLoading = true;

    this.catalogoService.filtrarProdutosCatalogo(
      this.registrosPorPagina,
      this.pagina,
      this.filtro.ordenacao.itemOrdenacao,
      this.filtro.ordenacao.ordem,
      this.filtro.filtroSuperior.termo,
      this.filtro.filtroLateral.idsEstados,
      this.filtro.filtroLateral.idsCategorias,
      this.filtro.filtroLateral.idsFornecedores,
      this.filtro.filtroLateral.idsMarcas,
      this.filtro.filtroSuperior.tipoBusca,
      this.filtro.empresa,
      this.filtro.tenant,
      this.filtro.tipoCatalogo,
      this.filtro.filtroLateral.primeiroFiltroCategoria,
      true,
      this.filtro.filtroSuperior.buscaDetalhada,
    ).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.registros = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.registros = new Array<any>();
            this.totalPaginas = 1;
          }

          this.isFirstLoad = false;
          this.produtosLoading = false;
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );

  }

  private obterParametrosIntegracaoSapHabilitado() {
    if (this.usuarioAtual.permissaoAtual.pessoaJuridica.integracaoSapHabilitada) {
      this.exibirFlagSapEm = this.usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEm;
      this.exibirFlagSapEmNaoAvaliada = this.usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEmNaoAvaliada;
      this.exibirFlagSapEntrFaturas = this.usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEntrFaturas;
      this.exibirFlagSapRevFatEm = this.usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapRevFatEm;
    }
  }

  private obterEmpresas() {
    this.empresasLoading = true;
    this.pessoaJuridicaService.obterEmpresasPaiFilho(this.empresa)
      .pipe(takeUntil(this.unsubscribe), finalize(() => this.empresasLoading = false))
      .subscribe((response) => this.empresas = response);
  }

}
