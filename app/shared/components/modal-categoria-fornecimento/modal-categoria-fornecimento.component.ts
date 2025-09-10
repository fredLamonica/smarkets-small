import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  TranslationLibraryService,
  FornecedorService,
  CategoriaFornecimentoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { CategoriaFornecimento, Ordenacao } from '@shared/models';
import { FornecedorCategoriaFornecimentoDto } from '@shared/models/dto/fornecedor-categoria-fornecimento-dto';
import { DynamicFilter, DynamicFilterType } from '@shared/models/fltros/dynamic-filter';
import { GenericFilter } from '@shared/models/fltros/generic-filter';
import { FilterResult } from '@shared/models/fltros/filter-result';
import { CategoriaFornecimentoInteresse } from '@shared/models/categoria-fornecimento/categoria-fornecimento-interesse';
import { TagFiltered } from '@shared/models/fltros/tag-filtered';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'modal-categoria-fornecimento',
  templateUrl: './modal-categoria-fornecimento.component.html',
  styleUrls: ['./modal-categoria-fornecimento.component.scss']
})
export class ModalCategoriaFornecimentoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() idFornecedor: number = 0;

  public pagina: number = 1;
  public itensPorPagina: number = 50;
  public totalPaginas: number = 0;

  public categorias: FornecedorCategoriaFornecimentoDto[] = [];
  private categoriasSelecionadas: FornecedorCategoriaFornecimentoDto[] = [];

  private filtroGenerico: GenericFilter;
  public opcoesFiltro = new Array<DynamicFilter>();

  public categoriaOutras = 'Outras';

  public categoriaFornecimentoInteresse: Array<CategoriaFornecimentoInteresse>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private fornecedorService: FornecedorService,
    private categoriaFornecimentoService: CategoriaFornecimentoService,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.ObterCategoriaFornecimentoInteresse();
    this.construirOpcoesFiltro();
    this.construirFiltroGenerico();
    this.filtrarCategoriasFornecimento();
  }

  private ObterCategoriaFornecimentoInteresse() {
    if (!this.categoriaFornecimentoInteresse) {
      this.categoriaFornecimentoService
        .obterCategoriaFornecimentoInteressePorCliente(this.idFornecedor)
        .subscribe(
          response => {
            if (response) {
              this.categoriaFornecimentoInteresse = response;
            }
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
        );
    }
  }

  private construirFiltroGenerico() {
    this.filtroGenerico = new GenericFilter(
      '',
      Ordenacao.ASC,
      this.itensPorPagina,
      this.pagina,
      null
    );
  }

  private construirOpcoesFiltro() {
    this.opcoesFiltro = [
      new DynamicFilter('descricao', DynamicFilterType.Text, 'Buscar Categoria', 5, null, null)
    ];
  }

  public outrasCategorias(): string {
    return this.categoriaFornecimentoInteresse
      ? this.categoriaFornecimentoInteresse.map(p => p.descricao).join(', ')
      : '';
  }

  private filtrarCategoriasFornecimento() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .FiltrarCategoriaFornecimento(this.idFornecedor, this.filtroGenerico)
      .subscribe(
        response => {
          if (response) {
            this.preencherCategorias(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.categorias = [];
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  private preencherCategorias(fornecedorCategorias: FornecedorCategoriaFornecimentoDto[]) {
    this.categorias = fornecedorCategorias.map(categoria => {
      let categoriaSelecionada = this.obterCategoriaSelecionada(categoria.idCategoriaFornecimento);

      if (categoriaSelecionada) {
        categoria.selected = categoriaSelecionada.selected;
      }

      let categoriaDto = new FornecedorCategoriaFornecimentoDto(
        categoria.idCategoriaFornecimento,
        categoria.descricao,
        categoria.possuiCategoria,
        categoria.selected
      );

      this.adicionarCategoriaSelecionada(categoriaDto);

      return categoriaDto;
    });
  }

  public atualizarCategorias() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .atualizarCategoriasFornecimento(
        this.idFornecedor,
        this.obterCategoriasSelecionadas(),
        !this.categoriaOutrasSelecionada()
      )
      .subscribe(
        response => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.activeModal.close(true);
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  private obterCategoriaSelecionada(idCategoria: number) {
    return this.categoriasSelecionadas.find(p => p.idCategoriaFornecimento == idCategoria);
  }

  private obterCategoriasSelecionadas() {
    const selecionadas = this.categoriasSelecionadas.filter(
      p => p.idCategoriaFornecimento != 0 && p.selected
    );
    return selecionadas.map(p => new CategoriaFornecimento(p.idCategoriaFornecimento));
  }

  public categoriaOutrasSelecionada(): boolean {
    let categoriaOutras = this.categoriasSelecionadas.find(
      p => p.descricao == this.categoriaOutras
    );
    return categoriaOutras ? categoriaOutras.selected : false;
  }

  public adicionarCategoriaSelecionada(categoria: FornecedorCategoriaFornecimentoDto) {
    if (!this.categoriaSelecionadasPossuiCategoria(categoria)) {
      this.categoriasSelecionadas.push(categoria);
    }
  }

  private categoriaSelecionadasPossuiCategoria(
    categoria: FornecedorCategoriaFornecimentoDto
  ): boolean {
    return this.categoriasSelecionadas.some(
      p => categoria.idCategoriaFornecimento === p.idCategoriaFornecimento
    );
  }

  public categoriaClicked(categoria: FornecedorCategoriaFornecimentoDto) {
    let categoriaSelecionadaIndex = this.categoriasSelecionadas.findIndex(
      p => p.idCategoriaFornecimento === categoria.idCategoriaFornecimento
    );
    if (categoriaSelecionadaIndex !== -1) {
      this.categoriasSelecionadas[categoriaSelecionadaIndex].selected = categoria.selected;
    } else {
      this.categoriasSelecionadas.push(categoria);
    }
  }

  public paginar(event) {
    this.filtroGenerico.pagina = event.pagina;
    this.filtroGenerico.itensPorPagina = event.total;
    this.pagina = event.pagina;
    this.filtrarCategoriasFornecimento();
  }

  private tratarFiltro(tagFiltered: TagFiltered): Array<FilterResult> {
    return Array<FilterResult>(
      new FilterResult(
        tagFiltered.name,
        tagFiltered.values.map(x => x.value)
      )
    );
  }

  public aplicarFiltro(tagFiltered: TagFiltered) {
    if (isNullOrUndefined(tagFiltered)) {
      this.filtroGenerico.filters = null;
      return this.filtrarCategoriasFornecimento();
    }

    this.filtroGenerico.filters = this.tratarFiltro(tagFiltered);
    this.filtroGenerico.pagina = 1;
    this.pagina = 1;
    this.filtrarCategoriasFornecimento();
  }
}
