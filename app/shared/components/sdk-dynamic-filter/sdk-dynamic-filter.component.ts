import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { indexOf, isEqual } from 'lodash';
import { DynamicFilterType, DynamicFilter } from '@shared/models/fltros/dynamic-filter';
import { TagFiltered, TagFilteredValue } from '@shared/models/fltros/tag-filtered';

@Component({
  selector: 'sdk-dynamic-filter',
  templateUrl: './sdk-dynamic-filter.component.html',
  styleUrls: ['./sdk-dynamic-filter.component.scss'],
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class SdkDynamicFilterComponent implements OnInit {
  public isVisibleDropdown: boolean = false;
  public isDropDown = false;
  public inputValue: number | string = '';
  public isMultiSelect: boolean = false;

  @Input() dynamicFilter: DynamicFilter;
  @Input() dropdownButtonName: string = 'Aplicar';
  @Input() clearFilter = new EventEmitter<any>();

  @Output() onFilter = new EventEmitter<TagFiltered>();

  public TagFiltered: TagFiltered;

  @Input() clearFilterOnBlur: boolean = true;

  constructor(private _eref: ElementRef) {}

  //#region init/destroy

  ngOnInit() {
    this.isDropDown =
      this.dynamicFilter.type === DynamicFilterType.Multiselect ||
      this.dynamicFilter.type === DynamicFilterType.Select;

    this.isMultiSelect = this.dynamicFilter.type === DynamicFilterType.Multiselect;
    this.clearFilter.subscribe(() => this.clearField());
  }

  ngOnDestroy() {
    this.clearFilter.unsubscribe();
  }

  //#endregion ng

  //#region Utilities

  private hasTagFiltered(): boolean {
    return this.TagFiltered && this.TagFiltered !== null && this.TagFiltered !== undefined;
  }

  private buildTagFiltered(value: TagFilteredValue): TagFiltered {
    let filter = new TagFiltered(this.dynamicFilter.propertyName);
    filter.add(value);

    return filter;
  }

  //#endregion Utilities

  public clearField() {
    this.inputValue = '';
    this.TagFiltered = null;
  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isVisibleDropdown = false;
    }
  }

  //#region clicked option / blur text input

  public onSelectedItem(value: any) {
    if (!this.hasTagFiltered()) {
      this.TagFiltered = new TagFiltered(this.dynamicFilter.propertyName);
    }

    if (this.isMultiSelect) {
      this.addOrRemoveMultiSelectValue(value);
    } else {
      this.selectedValueChanged(value);
    }
  }

  private addOrRemoveMultiSelectValue(value: any) {
    if (!value) return;

    let selectedValue = this.getTagFilteredValueFromSelectedObject(value);
    let existsValue = this.TagFiltered.containsValue(selectedValue);

    if (existsValue) {
      this.TagFiltered.removeValue(selectedValue);
    } else {
      this.TagFiltered.add(selectedValue);
    }
  }

  private selectedValueChanged(value: any) {
    if (!value) return;

    this.isVisibleDropdown = false;

    let selectedValue = this.getTagFilteredValueFromSelectedObject(value);
    let filter = this.buildTagFiltered(selectedValue);

    if (isEqual(filter, this.TagFiltered)) {
      this.TagFiltered = null;
    } else {
      this.TagFiltered = value;
    }

    this.onFilter.emit(filter);
  }

  public onTextChanged(text) {
    if (!text) return this.onFilter.emit(null);

    if (!this.isDropDown) {
      let tagFilteredValue = new TagFilteredValue(text, text);
      let result = this.buildTagFiltered(tagFilteredValue);

      this.onFilter.emit(result);
      if (this.clearFilterOnBlur) {
        this.inputValue = '';
      }
    }
  }

  //#endregion clicked option / blur text input

  public onApplyMultiselectClick() {
    this.isVisibleDropdown = false;

    if (this.isMultiSelect && this.hasTagFiltered()) {
      this.onFilter.emit(this.TagFiltered);
    }
  }

  private getTagFilteredValueFromSelectedObject(selectedValue: any): TagFilteredValue {
    const value = this.dynamicFilter.listOptionValue;
    const label = this.dynamicFilter.listOptionLabel;

    let filter = this.dynamicFilter.listOptions.find(p => p[value] === selectedValue[value]);

    return new TagFilteredValue(filter[label], filter[value]);
  }

  public getLabel(obj: any) {
    if (typeof obj === 'string') {
      return obj;
    }

    return obj[this.dynamicFilter.listOptionLabel];
  }

  public visibleDropdown() {
    this.isVisibleDropdown = !this.isVisibleDropdown;
  }

  public getDropdownTitle(): string {
    // if (this.isMultiSelect && !this.isVisibleDropdown) {
    //   return this.TagFiltered && this.TagFiltered.values.length > 0
    //     ? this.TagFiltered.values.length + ' Selecionado(s)'
    //     : this.dynamicFilter.placeholder;
    // } else if (this.isMultiSelect && this.isVisibleDropdown) {
    //   return this.dynamicFilter.placeholder;
    // }

    // return this.TagFiltered
    //   ? this.TagFiltered[this.dynamicFilter.listOptionLabel]
    //   : this.dynamicFilter.placeholder;

    return this.dynamicFilter.placeholder;
  }

  public hasSelectedItems(): boolean {
    return (
      this.TagFiltered &&
      this.TagFiltered.values &&
      this.TagFiltered.values.length > 0 &&
      !this.isVisibleDropdown
    );
  }
}
