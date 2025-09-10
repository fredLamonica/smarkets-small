import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import {
  ColunaComBotoes, CustomTableColumnType, CustomTableSettings, Ordenacao
} from '@shared/models';
import { IconeCustomTable } from '../../models/coluna-custom-table/coluna-com-icone';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements OnInit, OnChanges {
  componentId: string = '_' + Math.random().toString(36).substr(2, 9);

  @Input() settings: CustomTableSettings;
  @Input() source: Array<any>;
  @Input() classes: string;
  // tslint:disable-next-line: no-input-rename
  @Input('not-found') notFound: string;
  @Input() colunasComBotoes = new Array<ColunaComBotoes>();
  @Input() colunasComIcone = new Array<IconeCustomTable>();


  // tslint:disable-next-line: no-output-rename
  @Output('select') selectEmitter = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('sort') sortEmitter = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('button-click') buttonClickEmitter = new EventEmitter();

  items: Array<any>;
  selected: Array<number>;
  selectedRadio: number;
  Ordenacao = Ordenacao;

  constructor() { }

  ngOnInit() {
    this.selected = new Array<number>();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.reload();
  }

  //#region Checkbox
  selectAll() {
    if (this.isAllSelected()) { this.resetSelected(); } else {
      this.selected = this.allIndexes();
      this.items.forEach((i) => (i.checked = true));
    }

    this.exposeSelected();
  }

  select(index: number) {
    this.items[index].checked = !this.items[index].checked;
    if (!this.items[index].checked) { this.selected = this.selected.filter((i) => i !== index); } else { this.selected.push(index); }

    this.exposeSelected();
  }

  isAllSelected(): boolean {
    return this.selected.length && this.selected.length === this.items.length;
  }

  isSelected(index: number): boolean {
    return this.selected.findIndex((i) => i === index) > -1;
  }
  //#endregion

  // #region Radio
  selectRadio(index: number) {
    if (this.selectedRadio != null) { this.items[this.selectedRadio].checked = false; }

    this.selectedRadio = index;
    this.items[index].checked = true;

    this.exposeSelected();
  }

  getValue(source: any, property: string): any {
    const propTree = property.split('.');
    propTree.forEach((prop) => {
      source = source ? source[prop] : '';
    });
    return source;
  }

  reload() {
    this.resetSelected();
    if (this.source && this.settings) { this.getAllValues(); }
  }

  sort(sortProperty: string) {
    if (this.settings.sortBy === sortProperty) {
      if (this.settings.order === Ordenacao.ASC) { this.settings.order = Ordenacao.DESC; } else { this.settings.order = Ordenacao.ASC; }
    } else {
      this.settings.sortBy = sortProperty;
      this.settings.order = Ordenacao.ASC;
    }

    this.sortEmitter.emit({ sortBy: this.settings.sortBy, order: this.settings.order });
  }

  buttonClick(indexColunaExtra, indexBotao, indexItem) {
    this.buttonClickEmitter.emit({
      indexColunaExtra: indexColunaExtra,
      indexBotao: indexBotao,
      indexItem: indexItem,
    });
  }

  private allIndexes(): Array<number> {
    const indexes = new Array<number>();
    for (let i = 0; i < this.source.length; i++) { indexes.push(i); }
    return indexes;
  }
  // #endregion

  private resetSelected() {
    this.selected = new Array<number>();

    if (this.items) { this.items.forEach((i) => (i.checked = false)); }

    this.selectedRadio = null;

    this.exposeSelected();
  }

  private exposeSelected() {
    let selected: any;
    if (this.settings.selection === 'check') {
      selected = this.selected.map((i) => {
        return this.source[i];
      });
    } else if (this.settings.selection === 'radio') {
      if (this.selectedRadio != null) { selected = this.source[this.selectedRadio]; }
    }

    this.selectEmitter.emit(selected);
  }

  private getAllValues() {
    this.items = new Array<any>();
    this.source.forEach((source) => {
      const item = { checked: false };
      this.settings.columns.forEach((col) => {
        switch (col.type) {
          case CustomTableColumnType.enum:
            item[col.property] = this.getEnumDescription(
              col.enumType,
              this.getValue(source, col.property),
            );
            break;
          default:
            item[col.property] = this.getValue(source, col.property);
        }
      });

      this.colunasComBotoes.forEach((coluna) => {
        coluna.botoes.forEach((botao) => {
          if (botao.colunaValidacao && !item[botao.colunaValidacao]) {
            item[botao.colunaValidacao] = this.getValue(source, botao.colunaValidacao).toString();
          }
        });
      });

      this.items.push(item);
    });
  }

  private getEnumDescription(enumType: any, id: number) {
    return enumType[id];
  }
}
