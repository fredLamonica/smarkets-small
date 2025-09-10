import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  forwardRef,
  Output,
  EventEmitter
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ITreeState } from 'angular-tree-component';
import * as _ from 'lodash';

@Component({
  selector: 'input-tree',
  templateUrl: './input-tree.component.html',
  styleUrls: ['./input-tree.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputTreeComponent), multi: true }
  ]
})
export class InputTreeComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() source: Array<any>;

  @Input('value-property') valueProperty;
  @Input('key-property') keyProperty;
  @Input('children-property') childrenProperty;
  @Input('is-disabled') disabledProperty: boolean = false;
  @Input('loading') loading: boolean = false;

  @Output('empty-tree') emptyTreeEmitter = new EventEmitter();

  public nodes: Array<any>;

  public _selected: any;

  public description: string;

  public selectedTemp: any;

  public state: ITreeState;

  private modal;

  constructor(private modalService: NgbModal) {}

  get selected() {
    return this._selected.id;
  }

  set selected(value) {
    this._selected = value;
    if (value) this.propagateChange(this._selected.id);
    else this.propagateChange(null);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.source) {
      this.nodes = this.loadNodes(this.source);
      if (this._selected != null) {
        this.writeValue(this._selected);
      }
    }
  }

  private loadNodes(source: Array<any>): Array<any> {
    return source.map(node => {
      return {
        id: node[this.keyProperty],
        name: node[this.valueProperty],
        children:
          node[this.childrenProperty] && node[this.childrenProperty].length
            ? this.loadNodes(node[this.childrenProperty])
            : null,
        isExpanded: false
      };
    });
  }

  public buscarCategoria(content) {
    this.modal = this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
  }

  public onActivate(event) {
    this.selectedTemp = event.node;
  }

  private getDescription(node: any): string {
    if (!node.isRoot) {
      return this.getDescription(node.parent) + ' > ' + node.data.name;
    } else {
      return node.data.name;
    }
  }

  public clear() {
    this.selected = null;
    this.selectedTemp = null;
    this.description = '';
    this.state = {
      ...this.state,
      expandedNodeIds: {},
      activeNodeIds: {}
    };
  }

  public select() {
    this.selected = this.selectedTemp;
    this.description = this.getDescription(this._selected);
    this.modal.close();
  }

  public expandedNodes = {};

  public findSelectedNode(nodes: Array<any>, id: number) {
    if (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id == id) {
          this.description = nodes[i].name;
          this._selected = nodes[i];
          return nodes[i];
        }
        var found = this.findSelectedNode(nodes[i].children, id);
        if (found) {
          this.description = `${nodes[i].name} > ${this.description}`;
          this.expandedNodes[nodes[i].id] = true;
          return found;
        }
      }
    }
  }

  //#region FormControl Methods
  writeValue(obj: any): void {
    if (obj != null) {
      this._selected = obj;
      let activeNodeIds = {};
      let found = this.findSelectedNode(this.nodes, obj);
      if (found) activeNodeIds[found.id] = true;

      this.state = {
        ...this.state,
        expandedNodeIds: this.expandedNodes,
        activeNodeIds: activeNodeIds
      };
    } else if (!obj) {
      this.clear();
    }
  }
  propagateChange = (_: any) => {};
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
  //#endregion

  public emptyTree() {
    this.emptyTreeEmitter.emit();
  }

  public buscar(event) {
    if (event) {
      const sourceCopy = _.cloneDeep(this.source);
      this.nodes = this.loadNodes(this.filterSource(sourceCopy, event));
    } else {
      this.nodes = this.loadNodes(this.source);
    }
  }

  private filterSource(source: any[], event): any[] {
    for (let index = 0; index < source.length; index++) {
      const element = source[index];

      if (element.filhos && element.filhos.length) {
        element.filhos = this.filterSource(element.filhos, event);
      }
    }

    return source.filter(element => {
      if (element.nome) {
        return (
          element.nome.toLowerCase().includes(event.toLowerCase()) ||
          (element.filhos && element.filhos.length)
        );
      }
      if (element.descricao) {
        return (
          element.descricao.toLowerCase().includes(event.toLowerCase()) ||
          (element.filhos && element.filhos.length)
        );
      }
    });
  }
}
