import { Component, Injector, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { PedidoItem, PessoaJuridica, SituacaoPedidoItem } from '../../../../shared/models';
import { CatalogoService, PessoaJuridicaService } from '../../../../shared/providers';
import { PedidoService } from '../../../../shared/providers/pedido.service';
import { AbaContratoComponent } from '../base/aba-contrato.component';

@Component({
  selector: 'smk-aba-contrato-fornecedor',
  templateUrl: './aba-contrato-fornecedor.component.html',
  styleUrls: ['./aba-contrato-fornecedor.component.scss']
})
export class AbaContratoFornecedorComponent extends AbaContratoComponent implements OnInit {

  @Input() empresa: number;

  form: FormGroup;
  exibirFlagSapEm: boolean = false;
  exibirFlagSapEmNaoAvaliada: boolean = false;
  exibirFlagSapEntrFaturas: boolean = false;
  exibirFlagSapRevFatEm: boolean = false;
  empresas: Array<PessoaJuridica>;
  empresasLoading: boolean;

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
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  protected obter(): void {
    this.produtosLoading = true;

    this.catalogoService.filtrarProdutosContratoFornecedor(
      this.registrosPorPagina,
      this.pagina,
      this.filtro.ordenacao.itemOrdenacao,
      this.filtro.ordenacao.ordem,
      this.filtro.filtroSuperior.termo,
      this.filtro.filtroLateral.idsEstados,
      this.filtro.filtroLateral.idsCategorias,
      this.filtro.filtroLateral.idsClientes,
      this.filtro.filtroLateral.idsMarcas,
      this.filtro.filtroSuperior.tipoBuscaContrato,
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
