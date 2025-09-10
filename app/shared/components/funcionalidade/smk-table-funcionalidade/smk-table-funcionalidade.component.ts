import { AfterViewInit, Component, ContentChildren, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { camelCase } from 'lodash';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { takeUntil } from 'rxjs/operators';
import { ConfiguracaoColunaDto } from '../../../models/configuracao-coluna-dto';
import { ConfiguracaoColunaUsuarioDto } from '../../../models/configuracao-coluna-usuario-dto';
import { ConfiguracaoColunaUsuarioService } from '../../../providers/configuracao-coluna-usuario.service';
import { TranslationLibraryService } from '../../../providers/translation-library.service';
import { ErrorService } from '../../../utils/error.service';
import { CustomColumnDirective } from '../../data-list/directives/custom-column.directive';
import { SelectionModeEnum } from '../../data-list/models/selection-mode.enum';
import { SizeEnum } from '../../data-list/models/size.enum';
import { TableColumn } from '../../data-list/table/models/table-column';
import { TableConfig } from '../../data-list/table/models/table-config';
import { TablePagination } from '../../data-list/table/models/table-pagination';
import { TableComponent } from '../../data-list/table/table.component';
import { ModalConfirmacaoExclusao } from '../../modals/confirmacao-exclusao/confirmacao-exclusao.component';
import { ConfirmacaoComponent } from '../../modals/confirmacao/confirmacao.component';
import { SmkComponent } from '../base/smk-component';
import { ConfigTableFerramentas } from './models/config-table-ferramentas';
import { Ferramenta } from './models/ferramenta';
import { ResultadoModalConfigColunas } from './models/resultado-modal-config-colunas';

@Component({
  selector: 'smk-table-funcionalidade',
  templateUrl: './smk-table-funcionalidade.component.html',
  styleUrls: ['./smk-table-funcionalidade.component.scss'],
})
export class SmkTableFuncionalidadeComponent<T> extends SmkComponent implements OnInit, AfterViewInit, OnChanges {

  @BlockUI() blockUI: NgBlockUI;

  @Input() configuracaoDaTable: TableConfig<T>;
  @Input() itensDaTable: Array<T>;
  @Input() configuracaoFerramentasDaTable: ConfigTableFerramentas = new ConfigTableFerramentas();
  @Input() ferramentas?: Array<Ferramenta>;
  @Input() colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  @Input() configuracaoColunasUsuario: ConfiguracaoColunaUsuarioDto;
  @Input() tooltipExportar: string = 'Exportar';

  @Output() readonly colunasChange: EventEmitter<Array<ConfiguracaoColunaDto>> = new EventEmitter<Array<ConfiguracaoColunaDto>>();
  @Output() readonly colunasReset: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly export: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly selectedChange: EventEmitter<Array<T>> = new EventEmitter<Array<T>>();
  @Output() readonly pageChange: EventEmitter<TablePagination> = new EventEmitter<TablePagination>();

  @ViewChild(TableComponent) tableComponet: TableComponent<T>;

  @ContentChildren(CustomColumnDirective) columnTemplates: QueryList<CustomColumnDirective>;

  readonly nenhumRegistroEncontrado: string = 'Nenhum registro encontrado!';
  readonly tooltipResetConfiguracao: string = 'Voltar para a configuração original';

  readonly configuracaoDefaultDaTable: TableConfig<T> = new TableConfig<T>({
    size: SizeEnum.Small,
    selectionMode: SelectionModeEnum.Single,
    usePagination: true,
    tableHover: true,
    tableBordered: true,
    highlightSelected: true,
    emptyStateText: this.nenhumRegistroEncontrado,
    columns: new Array<TableColumn>(),
  });

  form: FormGroup;
  formConfiguracoesColuna: FormArray;
  modalDeConfiguracoes: NgbModalRef;
  loadingColunas: boolean;
  campoColuna = 'coluna';

  private indicesDeColunasDuplicadas: Array<number> = new Array<number>();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private configuracaoColunaUsuarioService: ConfiguracaoColunaUsuarioService,
    private errorService: ErrorService,

  ) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tableComponet.columnTemplates = this.columnTemplates;
    }, 250);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.configuracaoColunasUsuario) {
      if (this.configuracaoDaTable) {
        this.configureGrid();
      }
    }
  }

  reconstruaTable(itens: T[]) {
    this.tableComponet.reconstruaTable(itens);
  }

  exporte(): void {
    this.export.emit();
  }

  soliciteConfiguracaoDeColunas(modalDeConfiguracaoDeColunasTmp: TemplateRef<any>): void {
    this.construaForms();
    this.modalDeConfiguracoes = this.modalService.open(modalDeConfiguracaoDeColunasTmp, { centered: true, backdrop: 'static' });

    this.modalDeConfiguracoes.result.then(
      (resultado: ResultadoModalConfigColunas) => {
        if (resultado) {
          if (resultado.colunasConfiguradas) {
            this.salveConfiguracoesDasColunas(resultado.colunasConfiguradas);
          }

          if (resultado.resetarConfiguracao) {
            this.resetConfiguracoesDasColunas();
          }
        }
      },
      () => { },
    );
  }

  soliciteExclusaoDaColunaModal(indice: number): void {
    this.modalService.open(ModalConfirmacaoExclusao, { centered: true, size: 'sm' }).result.then(
      () => {
        this.indicesDeColunasDuplicadas.splice(this.indicesDeColunasDuplicadas.indexOf(indice), 1);
        this.indicesDeColunasDuplicadas = this.indicesDeColunasDuplicadas.map((x) => x = indice < x ? (x - 1) : x);
        this.formConfiguracoesColuna.removeAt(indice);
      },
      () => { },
    );
  }

  salveConfiguracoesDasColunasModal(): void {
    const colunasConfiguradasDoForm = this.formConfiguracoesColuna.value as Array<{ coluna: string }>;
    const colunasConfiguradas = new Array<ConfiguracaoColunaDto>();

    for (const colunaConfiguradaDoForm of colunasConfiguradasDoForm) {
      colunasConfiguradas.push(this.colunasDisponiveis.find((x) => x.coluna === colunaConfiguradaDoForm.coluna));
    }

    this.modalDeConfiguracoes.close(new ResultadoModalConfigColunas({ colunasConfiguradas: colunasConfiguradas }));
  }

  adicioneColunaModal(): void {
    this.formConfiguracoesColuna.push(this.fb.group({ coluna: [null, Validators.required] }));

    setTimeout(() => {
      const elModalBody = document.getElementById('modalBody');
      elModalBody.scroll({ top: elModalBody.scrollHeight, behavior: 'smooth' });
    }, 10);
  }

  soliciteResetarConfiguracaoDeColunasModal(): void {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true, size: 'sm' });

    modalRef.componentInstance.confirmacao = `Tem certeza que deseja ${this.tooltipResetConfiguracao.toLowerCase()}?`;

    modalRef.result.then(
      (resultado) => {
        if (resultado) {
          this.modalDeConfiguracoes.close(new ResultadoModalConfigColunas({ resetarConfiguracao: true }));
        }
      },
      () => { },
    );
  }

  private configureGrid(): void {
    this.configuracaoDaTable = new TableConfig<T>({
      ...this.configuracaoDefaultDaTable,
      ...this.configuracaoDaTable,
      columns: this.configuracaoColunasUsuario.colunas.map((x) => new TableColumn({ name: camelCase(x.coluna), title: x.label, type: x.tipo })),
    });
  }

  private construaForms(): void {
    this.form = this.fb.group({
      configuracoesColuna: this.fb.array([]),
    });

    this.formConfiguracoesColuna = this.form.get('configuracoesColuna') as FormArray;

    if (this.configuracaoColunasUsuario && this.configuracaoColunasUsuario.colunas && this.configuracaoColunasUsuario.colunas.length > 0) {
      for (const configuracaoColuna of this.configuracaoColunasUsuario.colunas) {
        this.formConfiguracoesColuna.push(this.fb.group({
          coluna: [configuracaoColuna.coluna, Validators.required],
        }));
      }

      this.formConfiguracoesColuna.valueChanges.pipe(
        takeUntil(this.unsubscribe))
        .subscribe(() => this.verifiqueColunaDuplicada());
    }
  }

  private verifiqueColunaDuplicada(): void {
    for (const indice of this.indicesDeColunasDuplicadas) {
      const control = this.formConfiguracoesColuna.at(indice);

      if (control) {
        const errors = this.formConfiguracoesColuna.at(indice).get(this.campoColuna).errors as Object || {};
        delete errors['duplicated'];
        this.formConfiguracoesColuna.at(indice).get(this.campoColuna).setErrors(Object.keys(errors).length === 0 ? null : (errors as ValidationErrors));
      }
    }

    this.indicesDeColunasDuplicadas = new Array<number>();

    const dict = {};

    this.formConfiguracoesColuna.value.forEach((item: { coluna: string }, index: number) => {
      if (item.coluna) {
        dict[item.coluna] = dict[item.coluna] || [];
        dict[item.coluna].push(index);
      }
    });

    for (const key in dict) {
      if (dict[key].length > 1) {
        this.indicesDeColunasDuplicadas = this.indicesDeColunasDuplicadas.concat(dict[key]);
      }
    }

    for (const index of this.indicesDeColunasDuplicadas) {
      this.formConfiguracoesColuna.at(index).get(this.campoColuna).setErrors({ duplicated: true });
    }
  }

  private salveConfiguracoesDasColunas(colunasConfiguradas: Array<ConfiguracaoColunaDto>): void {
    const houveAlteracao = JSON.stringify(colunasConfiguradas) !== JSON.stringify(this.configuracaoColunasUsuario.colunas);

    if (houveAlteracao) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.configuracaoColunasUsuario.colunas = colunasConfiguradas;

      this.configuracaoColunaUsuarioService.post(this.configuracaoColunasUsuario).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          () => {
            this.blockUI.stop();
            this.colunasChange.emit(colunasConfiguradas);
          },
          (error) => {
            this.blockUI.stop();
            this.errorService.treatError(error);
          });
    }
  }

  private resetConfiguracoesDasColunas(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.configuracaoColunaUsuarioService.delete(this.configuracaoColunasUsuario.identificadorFuncionalidade).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.blockUI.stop();
          this.colunasReset.emit();
        },
        (error) => {
          this.blockUI.stop();
          this.errorService.treatError(error);
        });
  }

}
