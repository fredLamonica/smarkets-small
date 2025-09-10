import { Component, OnInit } from '@angular/core';
import {
  PessoaJuridica,
  CustomTableSettings,
  CustomTableColumn,
  CustomTableColumnType,
  Ordenacao,
  Fornecedor,
  CategoriaProduto,
  Estado
} from '@shared/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  PessoaJuridicaService,
  FornecedorService,
  TranslationLibraryService,
  EstadoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { Subject, Observable, of, concat } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'incluir-fornecedor',
  templateUrl: './incluir-fornecedor.component.html',
  styleUrls: ['./incluir-fornecedor.component.scss']
})
export class IncluirFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public _idFornecedor: number;

  get idFornecedor(): number {
    return this._idFornecedor;
  }

  set idFornecedor(value) {
    this._idFornecedor = value;
    this.propagateChange(this._idFornecedor);
  }

  public fornecedores$: Observable<Array<PessoaJuridica>>;
  public categoriasProduto: Array<CategoriaProduto>;
  public categoriasSelecionadas: Array<CategoriaProduto>;

  public loading = false;
  public input$ = new Subject<string>();
  public fornecedoresParticipantes: Array<PessoaJuridica>;
  public estados: Array<Estado>;
  public termoEstado: number;

  private idPais = 30; //Brasil

  //#region FormControl Methods
  writeValue(obj: any): void {
    this.idFornecedor = obj;

    if (obj)
      this.fornecedores$ = this.fornecedorService.obterEmpresasFornecedorasPorRazaoSocial('');
  }
  propagateChange = (_: any) => {};
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
  //#endregion

  constructor(
    private fornecedorService: FornecedorService,
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private estadoService: EstadoService
  ) {}

  ngOnInit() {
    this.construirTabela();
    this.obterEstados();
    this.filtrarFornecedores();
  }

  private buscarFornecedoresPorDescricao() {
    this.fornecedores$ = concat(
      of([]), // default items
      this.input$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap(termo =>
          this.fornecedorService.obterEmpresasFornecedorasPorRazaoSocial(termo).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.loading = false))
          )
        )
      )
    );
  }

  // #region Seleção modal
  public settings: CustomTableSettings;
  public fornecedores: Array<PessoaJuridica>;

  public selecionado: Fornecedor;
  public registrosPorPagina: number = 5;
  public pagina: number = 1;
  public totalPaginas: number = 0;
  public ordenarPor: string = 'IdPessoaJuridica';
  public ordenacao: Ordenacao = Ordenacao.DESC;

  private construirTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn(
          'Empresa',
          'razaoSocial',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'razaoSocial'
        ),
        new CustomTableColumn('CNPJ', 'cnpj', CustomTableColumnType.text, null, null, null, 'cnpj'),
        new CustomTableColumn(
          'UF',
          'abreviacaoUnidadeFederativa',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'abreviacaoUnidadeFederativa'
        )
      ],
      'radio',
      this.ordenarPor,
      this.ordenacao
    );
  }

  public paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.filtrarFornecedores(null);
  }

  private filtrarFornecedores(termo = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    let idsFornecedoresParticipantes: Array<number> = null;

    if (this.fornecedoresParticipantes && this.fornecedoresParticipantes.length > 0) {
      idsFornecedoresParticipantes = this.fornecedoresParticipantes.map(f => f.idPessoaJuridica);
    }

    this.fornecedorService
      .obterEmpresasFornecedorasFiltrarExcetoCategorias(
        this.registrosPorPagina,
        this.pagina,
        this.ordenarPor,
        this.ordenacao,
        termo,
        idsFornecedoresParticipantes,
        this.termoEstado
      )
      .subscribe(
        response => {
          if (response) {
            this.fornecedores = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.fornecedores = new Array<Fornecedor>();
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

  public selecao(fornecedor: Fornecedor) {
    if (fornecedor) this.selecionado = fornecedor;
  }

  public buscar(termo) {
    this.pagina = 1;
    this.filtrarFornecedores(termo);
  }

  public ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.filtrarFornecedores();
  }

  public confirmar() {
    this.pagina = 1;
    this.registrosPorPagina = 5;
    this.idFornecedor = this.selecionado.idPessoaJuridica;
    this.fornecedores$ = this.fornecedorService.obterEmpresasFornecedorasPorRazaoSocial('');
    this.selecionado.categoriasProduto = this.categoriasSelecionadas;
    if (!this.selecionado.categoriasProduto || !this.selecionado.categoriasProduto.length)
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    else this.activeModal.close(this.selecionado);
  }
  // #endregion

  public cancelar() {
    this.activeModal.close();
  }

  private obterEstados() {
    this.estadoService.obterEstados(this.idPais).subscribe(
      response => {
        if (response) {
          this.estados = response;
        } else {
          this.estados = new Array<Estado>();
        }
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }
}
