import { AfterViewInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { ConfiguracaoColunaDto } from '../../../models/configuracao-coluna-dto';
import { ConfiguracaoColunaUsuarioDto } from '../../../models/configuracao-coluna-usuario-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../../models/configuracao-filtro-usuario-dto';
import { CustomColumnDirective } from '../../data-list/directives/custom-column.directive';
import { TableConfig } from '../../data-list/table/models/table-config';
import { TablePagination } from '../../data-list/table/models/table-pagination';
import { SmkComponent } from '../base/smk-component';
import { ConfigTableFerramentas } from '../smk-table-funcionalidade/models/config-table-ferramentas';
import { Ferramenta } from '../smk-table-funcionalidade/models/ferramenta';
import { SmkTableFuncionalidadeComponent } from '../smk-table-funcionalidade/smk-table-funcionalidade.component';

@Component({
  selector: 'smk-listar-funcionalidade',
  templateUrl: './smk-listar-funcionalidade.component.html',
  styleUrls: ['./smk-listar-funcionalidade.component.scss'],
})
export class SmkListarFuncionalidadeComponent<T> extends SmkComponent implements OnInit, AfterViewInit {

  @Input() rotaVoltar: string;
  @Input() titulo: string;
  @Input() tituloComplementar: string;
  @Input() configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  @Input() filtroInformado: boolean;
  @Input() configuracaoDaTable: TableConfig<T>;
  @Input() itensDaTable: Array<T>;
  @Input() configuracaoFerramentasDaTable: ConfigTableFerramentas = new ConfigTableFerramentas();
  @Input() colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  @Input() configuracaoColunasUsuario: ConfiguracaoColunaUsuarioDto;
  @Input() tooltipExportar: string = 'Exportar';
  @Input() ferramentas?: Array<Ferramenta>;

  @Output() readonly filtrosChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly filtrosClear: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly colunasChange: EventEmitter<Array<ConfiguracaoColunaDto>> = new EventEmitter<Array<ConfiguracaoColunaDto>>();
  @Output() readonly colunasReset: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly export: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly selectedChange: EventEmitter<Array<T>> = new EventEmitter<Array<T>>();
  @Output() readonly pageChange: EventEmitter<TablePagination> = new EventEmitter<TablePagination>();

  @ViewChild(SmkTableFuncionalidadeComponent) tableFuncionalidadeComponent: SmkTableFuncionalidadeComponent<T>;

  @ContentChildren(CustomColumnDirective) columnTemplates: QueryList<CustomColumnDirective>;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tableFuncionalidadeComponent.columnTemplates = this.columnTemplates;
    }, 150);
  }

}
