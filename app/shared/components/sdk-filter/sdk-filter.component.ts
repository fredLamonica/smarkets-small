import { Component, EventEmitter, Input, OnInit, Output, DebugElement } from '@angular/core';
import { DynamicFilter } from '@shared/models/fltros/dynamic-filter';
import { TagFiltered, TagFilteredValue } from '@shared/models/fltros/tag-filtered';
import { FilterResult } from '@shared/models/fltros/filter-result';

@Component({
  selector: 'sdk-filter',
  templateUrl: './sdk-filter.component.html',
  styleUrls: ['./sdk-filter.component.scss']
})
export class SdkFilterComponent implements OnInit {
  @Input() filters: Array<DynamicFilter> = [];
  @Input() scrollBackgroundColor: string = '#f5f5f5';
  @Input() filterKeySessionStorage: string;

  @Output() applyFilter = new EventEmitter<any>();

  public removeTagFilterEvent = new EventEmitter<any>();
  public tagFilters = new Array<TagFiltered>();
  public tagFiltersSessionStorage: Array<TagFiltered>;

  constructor() {}

  ngOnInit() {
    this.setFiltersFromSessionStorage();
  }

  private setFiltersFromSessionStorage() {
    if (!this.filterKeySessionStorage) {
      return;
    }

    this.tagFiltersSessionStorage = JSON.parse(
      sessionStorage.getItem(this.filterKeySessionStorage)
    );

    if (this.tagFiltersSessionStorage) {
      this.tagFiltersSessionStorage.forEach(tagFilterSession => {
        let tagFilter = new TagFiltered(tagFilterSession.name);
        tagFilter.add(tagFilterSession.values);

        this.addOrRemoveFilter(tagFilter);
      });

      this.onApplyFilter();
    }
  }

  private getIndex(filter: TagFiltered): number {
    return this.tagFilters.findIndex(p => p.name === filter.name);
  }

  public addOrRemoveFilter(filter: TagFiltered) {
    if (filter.name && filter.values) {
      const index = this.getIndex(filter);
      if (index === -1) {
        this.tagFilters.push(filter);
      } else {
        this.tagFilters[index] = filter;
      }
    }
  }

  public addOrRemoveFilters(filters: TagFiltered[]) {
    for (const filtered of filters) {
      this.addOrRemoveFilter(filtered);
    }
  }

  public onRemoveTag(name: string, TagFilteredValue: TagFilteredValue) {
    let clickedTagFiltered = this.tagFilters.find(p => p.name === name);

    if (clickedTagFiltered.values.length == 1) {
      let index = this.tagFilters.findIndex(p => p.name === name);
      this.tagFilters.splice(index, 1);
    }

    clickedTagFiltered.removeValue(TagFilteredValue);

    if (this.tagFilters.length == 0) {
      this.onApplyFilter();
    }
  }

  public clearFilter() {
    this.tagFilters = [];
    this.onApplyFilter();
  }

  public onApplyFilter() {
    if (this.applyFilter && this.tagFilters) {
      let filterResults = this.tagFilters.map(p => {
        return new FilterResult(
          p.name,
          p.values.map(x => x.value)
        );
      });

      sessionStorage.setItem(this.filterKeySessionStorage, JSON.stringify(this.tagFilters));

      this.applyFilter.emit(filterResults);
    }
  }
}
