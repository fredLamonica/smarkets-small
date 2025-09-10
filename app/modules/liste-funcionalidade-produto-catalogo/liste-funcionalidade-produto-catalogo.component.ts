import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CustomColumnDirective } from '../../shared/components/data-list/directives/custom-column.directive';
import { TableConfig } from '../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../shared/components/data-list/table/models/table-pagination';
import { ConfigTableFerramentas } from '../../shared/components/funcionalidade/smk-table-funcionalidade/models/config-table-ferramentas';
import { Ferramenta } from '../../shared/components/funcionalidade/smk-table-funcionalidade/models/ferramenta';
import { SmkTableFuncionalidadeComponent } from '../../shared/components/funcionalidade/smk-table-funcionalidade/smk-table-funcionalidade.component';
import { ConfiguracaoColunaDto } from '../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoColunaUsuarioDto } from '../../shared/models/configuracao-coluna-usuario-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../shared/models/configuracao-filtro-usuario-dto';

@Component({
  selector: 'smk-liste-funcionalidade-produto-catalogo',
  templateUrl: './liste-funcionalidade-produto-catalogo.component.html',
  styleUrls: ['./liste-funcionalidade-produto-catalogo.component.scss'],
})
export class ListeFuncionalidadeProdutoCatalogoComponent<T> extends Unsubscriber implements OnInit {

  @Input() class: string;
  @Input() configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  @Input() filtroInformado: boolean;
  @Input() configuracaoDaTable: TableConfig<T>;
  @Input() itensDaTable: Array<T>;
  @Input() configuracaoFerramentasDaTable: ConfigTableFerramentas = new ConfigTableFerramentas();
  @Input() ferramentas?: Array<Ferramenta>;
  @Input() colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  @Input() configuracaoColunasUsuario: ConfiguracaoColunaUsuarioDto;
  @Input() tooltipExportar: string = 'Exportar';

  @Output() readonly filtrosChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly filtrosClear: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly colunasChange: EventEmitter<Array<ConfiguracaoColunaDto>> = new EventEmitter<Array<ConfiguracaoColunaDto>>();
  @Output() readonly colunasReset: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly export: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly selectedChange: EventEmitter<Array<T>> = new EventEmitter<Array<T>>();
  @Output() readonly pageChange: EventEmitter<TablePagination> = new EventEmitter<TablePagination>();

  @ViewChild(SmkTableFuncionalidadeComponent) tableFuncionalidadeComponent: SmkTableFuncionalidadeComponent<T>;

  @ContentChildren(CustomColumnDirective) columnTemplates: QueryList<CustomColumnDirective>;

  constructor(private router: Router) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tableFuncionalidadeComponent.columnTemplates = this.columnTemplates;
    }, 150);
  }

  navegueTelaProdutos(): void {
    this.router.navigate(['contratos-fornecedor']);
  }

}
