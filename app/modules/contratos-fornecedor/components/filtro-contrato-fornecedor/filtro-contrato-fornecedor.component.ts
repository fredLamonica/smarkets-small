import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { ListContainerConfig } from '../../../../shared/components/data-list/list-container/models/list-container-config';
import { ListChangeEvent } from '../../../../shared/components/data-list/list/models/list-change-event';
import { ListConfig } from '../../../../shared/components/data-list/list/models/list-config';
import { Endereco, Paginacao, TipoEndereco } from '../../../../shared/models';
import { GrupoCategoriaProdutoDto } from '../../../../shared/models/dto/grupo-categoria-produto-dto';
import { GrupoClienteDto } from '../../../../shared/models/dto/grupo-cliente-dto';
import { GrupoEstadoDto } from '../../../../shared/models/dto/grupo-estado-dto';
import { GrupoMarcaDto } from '../../../../shared/models/dto/grupo-marca-dto';
import { CatalogoService } from '../../../../shared/providers/catalogo.service';
import { EnderecoService } from '../../../../shared/providers/endereco.service';
import { EstrategiaFiltro } from '../../../marketplace/models/estrategia-filtro.enum';
import { TipoFiltro } from '../../../marketplace/models/tipo-filtro.enum';
import { FiltroLateralContratoFornecedorComponent } from '../base/filtro-lateral-contrato-fornecedor.component';


@Component({
  selector: 'smk-filtro-contrato-fornecedor',
  templateUrl: './filtro-contrato-fornecedor.component.html',
  styleUrls: ['./filtro-contrato-fornecedor.component.scss']
})
export class FiltroContratoFornecedorComponent extends FiltroLateralContratoFornecedorComponent implements OnInit {

@BlockUI() blockUI: NgBlockUI;
  @Input() empresa: number;
  listContainerCollapsedItemsToDisplay: number = 6;

  estadosLoading: boolean;
  estados: Array<GrupoEstadoDto> = new Array<GrupoEstadoDto>();
  configListaDeEstados: ListContainerConfig = new ListContainerConfig({
    header: 'Estado de Atendimento',
    collapsedItemsToDisplay: this.listContainerCollapsedItemsToDisplay,
    expandedMaxHeightPx: this.listContainerExpandedMaxHeight,
    listConfig: new ListConfig({
      multiSelection: true,
      bindLabel: 'nome',
      bindQuantityLabel: 'total',
      justifiedLabel: true,
      bindValue: 'idEstado',
      emptyStateText: 'Nenhum estado encontrado',
      textUppercase: true,
    }),
  });

  marcasLoading: boolean;
  marcas: Array<GrupoMarcaDto> = new Array<GrupoMarcaDto>();
  configListaDeMarcas: ListContainerConfig = new ListContainerConfig({
    header: 'Marca',
    collapsedItemsToDisplay: this.listContainerCollapsedItemsToDisplay,
    expandedMaxHeightPx: this.listContainerExpandedMaxHeight,
    listConfig: new ListConfig({
      multiSelection: true,
      bindLabel: 'nome',
      bindQuantityLabel: 'total',
      justifiedLabel: true,
      bindValue: 'idMarca',
      emptyStateText: 'Nenhuma marca encontrada',
      textUppercase: true,
    }),
  });

  clientesLoading: boolean;
  clientes: Array<GrupoClienteDto> = new Array<GrupoClienteDto>();
  configListaDeClientes: ListContainerConfig = new ListContainerConfig({
    header: 'Clientes',
    collapsedItemsToDisplay: this.listContainerCollapsedItemsToDisplay,
    expandedMaxHeightPx: this.listContainerExpandedMaxHeight,
    listConfig: new ListConfig({
      multiSelection: true,
      bindLabel: 'razaoSocial',
      bindQuantityLabel: 'total',
      justifiedLabel: true,
      bindValue: 'idPessoaJuridica',
      emptyStateText: 'Nenhum cliente encontrado',
      textUppercase: true,
    }),
  });

  constructor(private catalogoService: CatalogoService,
    private enderecoService: EnderecoService,
    private toastr: ToastrService,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.empresa && changes.empresa) {
      if (this.filtroVazio === false) {
        this.limparTodosFiltros();
      }
      this.obterEnderecoEmpresaCompradora();
    }
  }

  filtrarPorEstado(listaDeEstadosChangeEvent: ListChangeEvent<number>): void {
    const filtroIdsEstados = (listaDeEstadosChangeEvent.selected as Array<number>);

    if (!this.filtro.filtroLateral.idsEstados || this.filtro.filtroLateral.idsEstados !== filtroIdsEstados) {
      this.filtro.filtroLateral.idsEstados = filtroIdsEstados;
    } else {
      this.filtro.filtroLateral.idsEstados = null;
    }

    this.processeFiltroVazio();

    if (!listaDeEstadosChangeEvent.clearAllEvent) {
      this.filtroChange.emit(this.filtro.filtroLateral);
    }

    this.obterFiltros(TipoFiltro.estadoDeAtendimento, listaDeEstadosChangeEvent.clearAllEvent ? EstrategiaFiltro.proprioFiltro : EstrategiaFiltro.demaisFiltros);
  }

  filtrarPorMarca(listaDeMarcasChangeEvent: ListChangeEvent<number>): void {
    const filtroIdsMarcas = (listaDeMarcasChangeEvent.selected as Array<number>);

    if (!this.filtro.filtroLateral.idsMarcas || this.filtro.filtroLateral.idsMarcas !== filtroIdsMarcas) {
      this.filtro.filtroLateral.idsMarcas = filtroIdsMarcas;
    } else {
      this.filtro.filtroLateral.idsMarcas = null;
    }

    this.processeFiltroVazio();

    if (!listaDeMarcasChangeEvent.clearAllEvent) {
      this.filtroChange.emit(this.filtro.filtroLateral);
    }

    this.obterFiltros(TipoFiltro.marca, listaDeMarcasChangeEvent.clearAllEvent ? EstrategiaFiltro.proprioFiltro : EstrategiaFiltro.demaisFiltros);
  }

  filtrarPorClientes(listaDeClientesChangeEvent: ListChangeEvent<number>): void {
    const filtroIdsClientes = (listaDeClientesChangeEvent.selected as Array<number>);

    if (!this.filtro.filtroLateral.idsClientes || this.filtro.filtroLateral.idsClientes !== filtroIdsClientes) {
      this.filtro.filtroLateral.idsClientes = filtroIdsClientes;
    } else {
      this.filtro.filtroLateral.idsClientes = null;
    }

    this.processeFiltroVazio();

    if (!listaDeClientesChangeEvent.clearAllEvent) {
      this.filtroChange.emit(this.filtro.filtroLateral);
    }

    this.obterFiltros(TipoFiltro.cliente, listaDeClientesChangeEvent.clearAllEvent ? EstrategiaFiltro.proprioFiltro : EstrategiaFiltro.demaisFiltros);
  }

  sincronizarFiltroDeEstados(listaDeEstadosSynchronizerEvent: ListChangeEvent<number>): void {
    const filtroIdsEstados = (listaDeEstadosSynchronizerEvent.selected as Array<number>);
    this.filtro.filtroLateral.idsEstados = filtroIdsEstados;
  }

  sincronizarFiltroDeMarcas(listaDeMarcasSynchronizerEvent: ListChangeEvent<number>): void {
    const filtroIdsMarcas = (listaDeMarcasSynchronizerEvent.selected as Array<number>);
    this.filtro.filtroLateral.idsMarcas = filtroIdsMarcas;
  }

  sincronizarFiltroDeClientes(listaDeClientesSynchronizerEvent: ListChangeEvent<number>): void {
    const filtroIdsClientes = (listaDeClientesSynchronizerEvent.selected as Array<number>);
    this.filtro.filtroLateral.idsClientes = filtroIdsClientes;
  }

  selecionarEstadosPorIds(ids: Array<Number>) {
    this.filtro.filtroLateral.idsEstados = ids;
    this.obterFiltros(TipoFiltro.estadoDeAtendimento, EstrategiaFiltro.demaisFiltros);
    setTimeout(() => this.selectItemsMessenger.next(ids), 10);
  }

  protected processeFiltroVazio(): void {
    this.filtroVazio = !this.filtro || !this.filtro.filtroLateral ||
      ((!this.filtro.filtroLateral.idsEstados || this.filtro.filtroLateral.idsEstados.length === 0) &&
        (!this.filtro.filtroLateral.idsCategorias || this.filtro.filtroLateral.idsCategorias.length === 0) &&
        (!this.filtro.filtroLateral.idsClientes || this.filtro.filtroLateral.idsClientes.length === 0) &&
        (!this.filtro.filtroLateral.idsMarcas || this.filtro.filtroLateral.idsMarcas.length === 0));
  }

  protected inicializeFiltros(): void {
    this.obterFiltros(TipoFiltro.todos, EstrategiaFiltro.proprioFiltro);
  }

  protected obterFiltros(tipoFiltro: TipoFiltro, estrategia: EstrategiaFiltro): void {
    switch (tipoFiltro) {
      case TipoFiltro.todos:
        this.obterEstados();
        this.obterCategorias();
        this.obterMarcas();
        this.obterClientes();

        break;

      case TipoFiltro.estadoDeAtendimento:
        if (estrategia === EstrategiaFiltro.demaisFiltros) {
          this.obterCategorias();
          this.obterMarcas();
          this.obterClientes();
        } else {
          this.obterEstados();
        }

        break;

      case TipoFiltro.categoria:
        if (estrategia === EstrategiaFiltro.demaisFiltros) {
          this.obterEstados();
          this.obterMarcas();
          this.obterClientes();

          if (this.somenteCategoriasPaiListadas) {
            this.obterCategorias();
          }
        } else {
          this.obterCategorias();
        }

        break;

      case TipoFiltro.marca:
        if (estrategia === EstrategiaFiltro.demaisFiltros) {
          this.obterEstados();
          this.obterCategorias();
          this.obterClientes();
        } else {
          this.obterMarcas();
        }

        break;

      case TipoFiltro.cliente:
        if (estrategia === EstrategiaFiltro.demaisFiltros) {
          this.obterEstados();
          this.obterCategorias();
          this.obterMarcas();
        } else {
          this.obterClientes();
        }

        break;
    }
  }
  protected obterEnderecoEmpresaCompradora(): void {
    this.enderecoService.filtrarPessoaJuridica(this.empresa, 2, 1, '', TipoEndereco.Entrega).pipe(
      takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe((response) => this.tratarEnderecosEmpresa(response));
  }

  private obterEstados() {
    this.estadosLoading = true;

    this.catalogoService.obterEstadosContratoFornecedor(
      this.filtro.filtroSuperior.termo,
      this.filtro.filtroLateral.idsEstados,
      this.filtro.filtroLateral.idsCategorias,
      this.filtro.filtroLateral.idsClientes,
      this.filtro.filtroLateral.idsMarcas,
      this.itensPorPagina,
      this.filtro.filtroSuperior.tipoBuscaContrato,
      this.filtro.empresa,
      this.filtro.tenant,
      this.filtro.tipoCatalogo,
      this.filtro.filtroLateral.primeiroFiltroCategoria,
      true,
      this.filtro.filtroSuperior.buscaDetalhada,
    ).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((estados) => {
        this.estados = estados ? estados : new Array<GrupoEstadoDto>();
        this.estadosLoading = false;
      });
  }

  private obterCategorias() {
    this.categoriasLoading = true;

    const obterCategoriasObservable = this.catalogoService.obterCategoriasContratoFornecedor(
      this.filtro.filtroSuperior.termo,
      this.filtro.filtroLateral.idsEstados,
      this.filtro.filtroLateral.idsCategorias,
      this.filtro.filtroLateral.idsClientes,
      this.filtro.filtroLateral.idsMarcas,
      this.itensPorPagina,
      this.filtro.filtroSuperior.tipoBuscaContrato,
      this.filtro.empresa,
      this.filtro.tenant,
      this.filtro.tipoCatalogo,
      this.filtro.filtroLateral.idCategoriaProdutoPai,
      this.filtro.filtroLateral.primeiroFiltroCategoria,
      true,
      this.filtro.filtroSuperior.buscaDetalhada,
    );

    if (this.somenteCategoriasPaiListadas && this.filtro.filtroLateral.idsCategorias) {
      this.ajusteConfiguracoesDeCategoria(false);
    }

    obterCategoriasObservable.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((categorias) => {
        this.categorias = categorias ? categorias : new Array<GrupoCategoriaProdutoDto>();
        this.categoriasLoading = false;
      });
  }

  private obterMarcas() {
    this.marcasLoading = true;

    this.catalogoService.obterMarcasContratoFornecedor(
      this.filtro.filtroSuperior.termo,
      this.filtro.filtroLateral.idsEstados,
      this.filtro.filtroLateral.idsCategorias,
      this.filtro.filtroLateral.idsClientes,
      this.filtro.filtroLateral.idsMarcas,
      this.itensPorPagina,
      this.filtro.filtroSuperior.tipoBuscaContrato,
      this.filtro.empresa,
      this.filtro.tenant,
      this.filtro.tipoCatalogo,
      this.filtro.filtroLateral.primeiroFiltroCategoria,
      true,
      this.filtro.filtroSuperior.buscaDetalhada,
    ).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((marcas) => {
        this.marcas = marcas ? marcas : new Array<GrupoMarcaDto>();
        this.marcasLoading = false;
      });
  }

  private obterClientes() {
    this.clientesLoading = true;

    this.catalogoService.obterClientesContratoFornecedor(
      this.filtro.filtroSuperior.termo,
      this.filtro.filtroLateral.idsEstados,
      this.filtro.filtroLateral.idsCategorias,
      this.filtro.filtroLateral.idsMarcas,
      this.filtro.filtroLateral.idsClientes,
      this.itensPorPagina,
      this.filtro.filtroSuperior.tipoBuscaContrato,
      this.filtro.empresa,
      this.filtro.tenant,
      this.filtro.tipoCatalogo,
      this.filtro.filtroLateral.primeiroFiltroCategoria,
      true,
      this.filtro.filtroSuperior.buscaDetalhada,
    ).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((clientes) => {
        this.clientes = clientes ? clientes : new Array<GrupoClienteDto>();
        this.clientesLoading = false;
      });
  }

  private tratarEnderecosEmpresa(enderecos: Paginacao<Endereco>) {

    const naoHaItensDisponiveis = 'Não há itens disponíveis à UF do CNPJ selecionado.';

    if (!enderecos || enderecos.total === 0) {
      //this.toastr.warning(naoHaItensDisponiveis);
    } else if (enderecos.total === 1) {
      const ids = enderecos.itens.map((item) => item.idEstado);
      for (const id of ids) {
        if (this.estados.find((estado) => estado.idEstado === id)) {
          this.selecionarEstadosPorIds(ids);
        } else {
          //this.toastr.warning(naoHaItensDisponiveis);
        }
      }

    } else {
      this.toastr.warning('Selecione o estado desejado.');
    }
  }

}
