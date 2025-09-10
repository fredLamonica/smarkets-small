import { AfterContentInit, Component, ContentChild, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomLabelDirective } from '../../../directives/custom-label.directive';
import { Guid } from '../../../utils/guid';
import { BaseComponent } from '../../base/base-component';
import { CustomQuantityLabelDirective } from '../list/directives/custom-quantity-label.directive';
import { ListComponent } from '../list/list.component';
import { ListChangeEvent } from '../list/models/list-change-event';
import { ListContainerConfig } from './models/list-container-config';

@Component({
  selector: 'smk-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss'],
})
export class ListContainerComponent<T> extends BaseComponent implements OnInit, OnChanges, AfterContentInit {

  @Input() config: ListContainerConfig;
  @Input() items: Array<T>;
  @Input() clearSelectionObserver: Observable<void>;
  @Input() selectItemsObserver: Observable<Array<Number>>;
  @Input() listLoading: boolean;
  @Output() readonly selectedChange: EventEmitter<ListChangeEvent<T>> = new EventEmitter<ListChangeEvent<T>>();
  @Output() readonly selectedSynchronizer: EventEmitter<ListChangeEvent<T>> = new EventEmitter<ListChangeEvent<T>>();
  @ViewChild('list') elList: ElementRef;
  @ViewChild(ListComponent) listComponet: ListComponent<T>;
  @ContentChild(CustomLabelDirective, { read: TemplateRef }) listCustomLabelTmp: TemplateRef<CustomLabelDirective>;
  @ContentChild(CustomQuantityLabelDirective, { read: TemplateRef }) listCustomQuantityLabelTmp: TemplateRef<CustomQuantityLabelDirective>;

  idList: string;
  expandable: boolean;
  isExpanded: boolean;
  maxHeight: string;
  listMaxHeight: string;
  selectedQuantity: number;
  totalQuantity: number;

  private readonly defaultMaxHeight: number = null;
  private readonly itemHeight: number = 21;
  private readonly allSelectorHeight: number = 35;
  private readonly minHeight: number = 100;

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.idList = new Guid().toString();
    this.setupExpandable();
    this.setupConfig();
    this.setupItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config) {
      this.setupExpandable();

      if (!changes.config.firstChange) {
        this.setupConfig();
      }
    }

    if (changes.items) {
      this.setupExpandable();
      this.setupConfig();

      if (this.isExpanded) {
        this.toggleMaxHeight();
      }

      this.setupItems();
    }
  }

  ngAfterContentInit(): void {
    this.listComponet.customLabelTmp = this.listCustomLabelTmp;
    this.listComponet.customQuantityLabelTmp = this.listCustomQuantityLabelTmp;
  }

  /**
   * Observer for list seleted synchronizer.
   * @param listChangeEvent The list change event object.
   */
  listSelectedSynchronizer(listChangeEvent: ListChangeEvent<T>): void {
    if (listChangeEvent.noneSelected) {
      this.selectedQuantity = 0;
    } else if (Array.isArray(listChangeEvent.selected)) {
      this.selectedQuantity = (listChangeEvent.selected as Array<T>).length;
    } else {
      this.selectedQuantity = 1;
    }

    this.selectedSynchronizer.emit(listChangeEvent);
  }

  /**
   * Observer for list total selectable items change.
   * @param totalQuantity The total quantity.
   */
  listTotalSelectableItemsChange(totalQuantity: number): void {
    this.totalQuantity = totalQuantity;
  }

  /**
   * Toggle max-height of component and inner list.
   */
  toggleMaxHeight(): void {
    if (this.expandable) {
      this.setupMaxHeight(!this.isExpanded);

      if (!this.isExpanded) {
        setTimeout(() => this.isExpanded = !this.isExpanded, 200);
      } else {
        this.isExpanded = !this.isExpanded;
        this.elList.nativeElement.scroll({ top: 0, behavior: 'smooth' });
      }
    }
  }

  /**
   * Setup 'expandable' flag.
   */
  private setupExpandable(): void {
    this.expandable = this.config.collapsedItemsToDisplay && this.items && this.config.collapsedItemsToDisplay < this.items.length;
  }

  /**
   * Set max-height of component and inner list.
   * @param isExpanded The flag if is expanded.
   */
  private setupMaxHeight(isExpanded: boolean): void {
    const maxHeight: number = isExpanded ? this.getExpandedMaxHeight() : this.getCollapsedMaxHeight();

    if (maxHeight && maxHeight !== this.defaultMaxHeight) {
      const listMaxHeight: number = maxHeight && maxHeight !== this.defaultMaxHeight
        ? maxHeight - 100
        : this.defaultMaxHeight;

      this.maxHeight = `${maxHeight}px`;

      if (listMaxHeight && listMaxHeight > 0) {
        this.listMaxHeight = `${listMaxHeight}px`;
      }
    }
  }

  /**
   * Get the collapsed max-height.
   */
  private getCollapsedMaxHeight(): number {
    if (this.config.collapsedItemsToDisplay) {
      let collapsedMaxHeight: number = this.minHeight;

      if (this.config.listConfig.allSelector) {
        collapsedMaxHeight += this.allSelectorHeight;
      }

      for (let i = 0; i < this.config.collapsedItemsToDisplay; i++) {
        collapsedMaxHeight += this.itemHeight;
      }

      return collapsedMaxHeight;
    } else {
      return this.defaultMaxHeight;
    }
  }

  /**
   * Get the expanded max-height.
   */
  private getExpandedMaxHeight(): number {
    return this.config.expandedMaxHeightPx ? +this.config.expandedMaxHeightPx.match(/\d+/)[0] : this.defaultMaxHeight;
  }

  /**
   * Setup config.
   */
  private setupConfig(): void {
    if (this.config) {
      if (this.expandable) {
        if (!this.config.labelCollapse) {
          this.config.labelCollapse = 'Menos';
        }

        if (!this.config.labelExpand) {
          this.config.labelExpand = 'Mais';
        }
      }

      this.setupMaxHeight(this.isExpanded);
    }

    this.checkConsistency();
  }

  /**
 * Setup list items.
 */
  private setupItems(): void {
    this.selectedQuantity = 0;
  }

  /**
   * Check consistency.
   */
  private checkConsistency(): void {
    this.compromisedConsistency = false;

    if (!this.config) {
      this.throwError(`input property 'config' is required`);
    } else {
      if (!this.config.header) {
        this.throwError(`'header config' is required`);
      }

      if (!this.config.listConfig) {
        this.throwError(`'list config' is required`);
      }

      // if (!this.config.expandable && (this.config.expandedMaxHeightPx || this.config.collapsedMaxHeight)) {
      //   this.throwError(`to use 'max-height configs' the 'expandable config' must be 'true'`);
      // }

      // if (this.config.expandable && this.config.expandedMaxHeight && !this.config.collapsedMaxHeight) {
      //   this.throwError(`'collapsed max-height config' is required to use 'expanded max-height config'`);
      // }

      // if (this.config.expandable && !this.config.expandedMaxHeightPx && !this.config.collapsedMaxHeight) {
      //   this.throwError(`to use 'expandable config' the 'max-height configs' are required`);
      // }

      // if (!this.config.expandable && (this.config.labelExpand || this.config.labelCollapse)) {
      //   this.throwError(`to use 'label configs' the 'expandable config' must be 'true'`);
      // }

      // if (this.config.expandable && !this.config.labelExpand && !this.config.labelCollapse) {
      //   this.throwError(`to use 'expandable config' the 'label configs' are required`);
      // }
    }
  }
}
