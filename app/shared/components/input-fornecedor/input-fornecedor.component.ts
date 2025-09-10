import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CustomTableColumn,
  CustomTableColumnType, CustomTableSettings, Ordenacao, PessoaJuridica
} from '@shared/models';
import {
  FornecedorService, PessoaJuridicaService, TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'input-fornecedor',
  templateUrl: './input-fornecedor.component.html',
  styleUrls: ['./input-fornecedor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFornecedorComponent),
      multi: true,
    },
  ],
})
export class InputFornecedorComponent implements OnInit, ControlValueAccessor {

  get idFornecedor(): number {
    return this._idFornecedor;
  }

  set idFornecedor(value) {
    this._idFornecedor = value;
    this.propagateChange(this._idFornecedor);
  }
  @BlockUI() blockUI: NgBlockUI;

  _idFornecedor: number;

  fornecedores$: Observable<Array<PessoaJuridica>>;
  loading = false;
  input$ = new Subject<string>();

  // #region Seleção modal
  form: FormGroup;
  settings: CustomTableSettings;
  fornecedores: Array<PessoaJuridica>;

  modalRef: any;

  selecionado: PessoaJuridica;
  registrosPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'pj.IdPessoaJuridica';
  ordenacao: Ordenacao = Ordenacao.DESC;
  //#endregion

  constructor(
    private pessoaJuridicaService: PessoaJuridicaService,
    private fornecedorService: FornecedorService,
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {}

  //#region FormControl Methods
  writeValue(obj: any): void {
    this.idFornecedor = obj;
    if (obj) {
      this.fornecedores$ = this.fornecedorService.obterEmpresasFornecedorasPorRazaoSocial('');
    }
  }
  propagateChange = (_: any) => {};
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit() {
    this.buscarFornecedoresPorDescricao();
  }

  buscarFornecedoresPorDescricao() {
    this.fornecedores$ = concat(
      of([]), // default items
      this.input$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap((termo) =>
          this.fornecedorService.obterEmpresasFornecedorasPorRazaoSocial(termo).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.loading = false)),
          ),
        ),
      ),
    );
  }

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.filtrarFornecedores(null);
  }

  selecao(fornecedor: PessoaJuridica) {
    this.selecionado = fornecedor;
  }

  async abriModal(content) {
    this.construirForm();
    this.construirTabela();
    this.filtrarFornecedores(content);
  }

  buscar() {
    this.pagina = 1;
    this.filtrarFornecedores();
  }

  ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.filtrarFornecedores();
  }

  limpar() {
    this.form.patchValue({
      termo: '',
    });
    this.buscar();
  }

  confirmar() {
    this.pagina = 1;
    this.registrosPorPagina = 5;
    this.idFornecedor = this.selecionado.idPessoaJuridica;
    this.fornecedores$ = new Observable((subscriber) => {
      subscriber.next([this.selecionado]);
    });
    this.modalRef.close();
  }
  // #endregion

  cancelar() {
    this.modalRef.close();
  }

  private construirForm() {
    this.form = this.formBuilder.group({
      termo: [''],
    });
  }

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
          'razaoSocial',
        ),
        new CustomTableColumn(
          'Código do ERP',
          'codigoFornecedor',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'codigoFornecedor',
        ),
        new CustomTableColumn('CNPJ', 'cnpj', CustomTableColumnType.text, null, null, null, 'cnpj'),
      ],
      'radio',
      this.ordenarPor,
      this.ordenacao,
    );
  }

  private filtrarFornecedores(content?) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const filtro = this.form.value;
    this.fornecedorService
      .filtrarPaginado(
        this.registrosPorPagina,
        this.pagina,
        this.ordenarPor,
        this.ordenacao,
        this.form.value.termo,
        '',
        '',
      )
      .subscribe(
        (response) => {
          if (response) {
            this.fornecedores = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.fornecedores = new Array<PessoaJuridica>();
            this.totalPaginas = 1;
          }
          if (content) {
            this.modalRef = this.modalService.open(content, { size: 'lg', centered: true });
          }

          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }
}
