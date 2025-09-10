import { AfterContentInit, Component, ContentChild, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { groupBy } from 'lodash';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomLabelDirective } from '../../../directives/custom-label.directive';
import { Guid } from '../../../utils/guid';
import { BaseComponent } from '../../base/base-component';
import { CustomQuantityLabelDirective } from './directives/custom-quantity-label.directive';
import { ListChangeEvent } from './models/list-change-event';
import { ListConfig } from './models/list-config';

@Component({
  selector: 'smk-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent<T> extends BaseComponent implements OnInit, AfterContentInit, OnChanges {
  @Input() config: ListConfig;
  @Input() items: Array<T>;
  @Input() clearSelectionObserver: Observable<void>;
  @Input() selectItemsObserver: Observable<Array<Number>>;
  @Input() loading: boolean;
  @Output() readonly selectedChange: EventEmitter<ListChangeEvent<T>> = new EventEmitter<ListChangeEvent<T>>();
  @Output() readonly selectedSynchronizer: EventEmitter<ListChangeEvent<T>> = new EventEmitter<ListChangeEvent<T>>();
  @Output() readonly totalSelectableItemsChange: EventEmitter<number> = new EventEmitter<number>();
  @ContentChild(CustomLabelDirective, { read: TemplateRef }) customLabelTmp: TemplateRef<CustomLabelDirective>;
  @ContentChild(CustomQuantityLabelDirective, { read: TemplateRef }) customQuantityLabelTmp: TemplateRef<CustomQuantityLabelDirective>;

  id: string;
  allSelected: boolean;

  _items: Array<T & { selected: boolean, parent: boolean }>;

  private selectedItems: Array<T> = new Array<T>();

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.id = new Guid().toString();
    this.checkConsistency();
    this.subscribeObservers();
  }

  ngAfterContentInit() {
    this.checkConsistencyTemplates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config && !changes.config.firstChange) {
      this.checkConsistency();
      this.checkConsistencyTemplates();
    }

    if (changes.items) {
      this.setupItems();
      this.setupSelectedItems();
    }
  }

  /**
   * All selector change (check or uncheck) observer.
   * @param clearAllEvent Flag to indicate that it is an event-triggered cleanup.
   */
  allSelectorChange(clearAllEvent: boolean): void {
    if (this.allSelected) {
      this.selectAll();
    } else {
      this.clearAllSelections();
    }

    this.emitSelected(clearAllEvent);
  }

  /**
   * Check if the item is selectable base on configs.
   * @param item The item on list.
   */
  isSelectable(item: T & { selected: boolean, parent: boolean }): boolean {
    return this.config.multiSelection && ((item.parent && this.config.parentIsSelectable) || !item.parent);
  }

  /**
   * Toggle selection of item.
   * @param item The item on list.
   * @param labelClick The event handdle on click label.
   */
  toggle(index: number, labelClick: boolean): void {
    this.selectItem(index, labelClick, true);
  }

  /**
   * Select selection of item.
   * @param index The index of item on list.
   * @param labelClick The event handdle on click label.
   * @param isToggle The item is toggleble.
   */
  private selectItem(index: number, labelClick: boolean, isToggle: boolean): void {
    if (!this.config.multiSelection) {
      this.clearAllSelections();
    } else if (labelClick) {
      return;
    }

    const item = this._items[index];

    if (isToggle) {
      item.selected = !item.selected;
    } else {
      item.selected = true;
    }

    // If configured selecting the parent selects all children.
    if (this.config.multiSelection && this.config.parentIsSelectable && this.config.parentSelectAllChildren) {
      if (item.parent) {
        this.selectAllParentChildren(item);
      } else {
        this.selectParent(item, item.selected && this.areAllChildrenSelected(item));
      }
    }

    this.allSelected = this.config.multiSelection && this.config.allSelector && this.areAllSelected();

    this.emitSelected(false);
  }

  /**
   * Subscribes to observers to be triggered by parent components.
   */
  private subscribeObservers(): void {
    if (this.clearSelectionObserver) {
      this.clearSelectionObserver.pipe(
        takeUntil(this.unsubscribe))
        .subscribe(() => {
          this.allSelected = false;
          this.allSelectorChange(true);
        });
    }
    if (this.selectItemsObserver) {
      this.selectItemsObserver.pipe(
        takeUntil(this.unsubscribe))
        .subscribe((selectedIds) => {
          for (const selectedId of selectedIds) {
            const index = this._items.findIndex((item) => item[this.config.bindValue] === selectedId);
            this.selectItem(index, false, false);
          }
        });
    }
  }

  /**
   * Setup list items.
   */
  private setupItems(): void {
    if (this.items && this.config) {
      const clonedItems = this.items.map((item) => ({ ...item, selected: false, parent: false }));

      if (this.config.parentKey && this.config.parentValue) {
        const itemsGroupedByParentKey = groupBy(clonedItems, this.config.parentValue);

        this._items = new Array<T & { selected: boolean, parent: boolean }>();

        const parentKeys = Object.keys(itemsGroupedByParentKey);

        for (const parentKey of parentKeys) {
          if (parentKey) {
            if (parentKey !== 'undefined') {
              const currentParent = clonedItems.find((item) => item[this.config.parentKey] === parentKey || item[this.config.parentKey] === +parentKey);

              // Add parent.
              if (currentParent) {
                currentParent.parent = true;
                this._items.push(currentParent);
              }

              // And children.
              this._items.push(...itemsGroupedByParentKey[parentKey]);
            } else if (parentKeys.length === 1) {
              // All are parent.
              for (const item of itemsGroupedByParentKey[parentKey]) {
                this._items.push({ ...item, parent: true });
              }
            }
          }
        }
      } else {
        this._items = clonedItems;
      }

      this.totalSelectableItemsChange.emit(this.getTotalQuantityOfSelectableItems());
    }
  }

  /**
   * Setup selected items.
   */
  private setupSelectedItems(): void {
    if (this.selectedItems && this.selectedItems.length > 0) {
      const sameItemFn: (item: T & { selected: boolean, parent: boolean }, selectedItem: T) => boolean =
        (item: T & { selected: boolean, parent: boolean }, selectedItem: T) => {
          if (this.config.bindValue) {
            return item[this.config.bindValue] === selectedItem;
          } else {
            const clonedItemA = { ...item };
            const clonedItemB = { ...selectedItem };

            this.deleteAditionalProperties(clonedItemA);

            return JSON.stringify(clonedItemA) === JSON.stringify(clonedItemB);
          }
        };

      for (let i = this.selectedItems.length - 1; i >= 0; i--) {
        let selectedItemFound: boolean = false;

        for (const item of this._items) {
          if (sameItemFn(item, this.selectedItems[i])) {
            item.selected = true;
            selectedItemFound = true;
          }
        }

        if (!selectedItemFound) {
          this.selectedItems.splice(i, 1);
        }
      }

      this.emitSelectedSynchronizer(false, this.selectedItems.length === 0);
    }
  }

  /**
   * Checks if all items are selected.
   */
  private areAllSelected(): boolean {
    return this._items.length > 0 && this._items.findIndex((item) => !item.selected && (!item.parent || (item.parent && this.config.parentIsSelectable))) === -1;
  }

  /**
   * Checks if all child items of the given parent are selected.
   * @param item The child item with the parent value.
   */
  private areAllChildrenSelected(child: T & { selected: boolean, parent: boolean }): boolean {
    return this._items.length > 0 && this._items.findIndex((item) => item[this.config.parentValue] === child[this.config.parentValue] && !item.selected) === -1;
  }

  /**
   * Select all items respecting the 'parent is selectable' config.
   */
  private selectAll(): void {
    const itemsToBeSelected = this._items.filter((item) => !item.parent || (item.parent && this.config.parentIsSelectable));
    itemsToBeSelected.map((item) => (item.selected = true));
  }

  /**
   * Select the parent of the given child.
   * @param item The child item with the parent value.
   */
  private selectParent(child: T & { selected: boolean, parent: boolean }, selected: boolean): void {
    const parent = this._items.find((item) => item[this.config.parentKey] === child[this.config.parentValue]);
    parent.selected = selected;
  }

  /**
   * Select all children of the given parent.
   * @param item The child item with the parent value.
   */
  private selectAllParentChildren(parent: T & { selected: boolean, parent: boolean }): void {
    const children = this._items.filter((item) => item[this.config.parentValue] === parent[this.config.parentKey]);
    children.map((item) => (item.selected = parent.selected));
  }

  /**
   * Get total quantity of selectable items.
   */
  private getTotalQuantityOfSelectableItems(): number {
    let totalQuantity: number = 0;

    if (this._items.length > 0) {
      for (const item of this._items) {
        if (!item.parent || (item.parent && this.config.parentIsSelectable)) {
          totalQuantity++;
        }
      }
    }

    return totalQuantity;
  }

  /**
   * Clear all selections.
   */
  private clearAllSelections(): void {
    this._items.map((item) => (item.selected = false));
  }

  /**
   * Emit the selected items.
   * @param clearAllEvent Flag to indicate that it is an event-triggered cleanup.
   */
  private emitSelected(clearAllEvent: boolean): void {
    const clonedItems = this._items.map((item) => ({ ...item }));

    let selected = clonedItems.filter((item) => item.selected);
    let noneSelected: boolean = selected.length === 0;

    // Process none selected with config 'none selected is all selected.
    if (selected.length === 0 && this.config.multiSelection && this.config.noneSelectedIsAllSelected) {
      selected = clonedItems.filter((item) => !item.parent || (item.parent && this.config.parentIsSelectable));
      noneSelected = true;
    }

    if (selected.length > 0) {
      if (this.config.bindValue) {
        selected = selected.map((item) => item[this.config.bindValue]);
      } else {
        selected = selected.map((item) => {
          this.deleteAditionalProperties(item);
          return item;
        });
      }
    }

    this.selectedItems = selected;

    this.selectedChange.emit(new ListChangeEvent<T>({
      selected: (this.config.multiSelection ? selected : selected[0]),
      noneSelected: noneSelected,
      clearAllEvent: clearAllEvent,
    }));

    this.emitSelectedSynchronizer(clearAllEvent, noneSelected);
  }

  /**
   * Emit the selected items.
   * @param clearAllEvent Flag to indicate that it is an event-triggered cleanup.
   * @param noneSelected Flag to indicate that is none item selected.
   */
  private emitSelectedSynchronizer(clearAllEvent: boolean, noneSelected: boolean): void {
    this.selectedSynchronizer.emit(new ListChangeEvent<T>({
      selected: (this.config.multiSelection ? this.selectedItems : this.selectedItems[0]),
      noneSelected: noneSelected,
      clearAllEvent: clearAllEvent,
    }));
  }

  /**
   * Delete aditional properties.
   * @param item The item.
   */
  private deleteAditionalProperties(item: T & { selected: boolean, parent: boolean }) {
    delete item.selected;
    delete item.parent;
  }

  /**
   * Check consistency.
   */
  private checkConsistency(): void {
    this.compromisedConsistency = false;

    if (!this.items) {
      this.throwError(`input property 'items' is required`);
    }

    if (!this.config) {
      this.throwError(`input property 'config' is required`);
    } else {

      if (!this.config.multiSelection && this.config.allSelector) {
        this.throwError(`config conflict between 'is not multi selection' and 'all selector visible'`);
      }

      if (!this.config.multiSelection && this.config.noneSelectedIsAllSelected) {
        this.throwError(`config conflict between 'is not multi selection' and 'none selected is all selected'`);
      }

      if ((this.config.parentKey && !this.config.parentValue) || (!this.config.parentKey && this.config.parentValue)) {
        this.throwError(`to use hierarchy the configs 'parent key' and 'parent value' are required`);
      }

      if (this.config.parentValue === 'parent') {
        this.throwError(`to use hierarchy the config 'parent value' must be different of 'parent'`);
      }

      if (!this.config.parentIsSelectable && this.config.parentSelectAllChildren) {
        this.throwError(`config conflict between 'parent is not selectable' and 'parent select all children'`);
      }
    }
  }

  /**
   * Check consistency of custom templates.
   */
  private checkConsistencyTemplates(): void {
    if (this.config && !this.config.bindLabel && !this.config.bindQuantityLabel && !this.customLabelTmp && !this.customQuantityLabelTmp) {
      this.throwError(`'config.bindLabel' or 'config.bindQuantityLabel' or 'labelTemplate' or 'quantityLabelTemplate' is required`);
    }
  }
}
