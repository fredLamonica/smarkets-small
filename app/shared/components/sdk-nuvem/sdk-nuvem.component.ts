import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ISelectable } from '@shared/models/interfaces/ISelectable';

@Component({
  selector: 'sdk-nuvem',
  templateUrl: './sdk-nuvem.component.html',
  styleUrls: ['./sdk-nuvem.component.scss']
})
export class SdkNuvemComponent implements OnInit {
  @Input() tags: Array<ISelectable> = [];

  @Input() label: string;
  @Input() key: string;

  @Output() tagClickedEvent = new EventEmitter<ISelectable>();
  @Output() pagedEvent = new EventEmitter<any>();

  @Input() pageIndex: number = 1;
  @Input() pageSize: number = 50;
  @Input() totalPages: number = 1;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  public orderTags() {
    if (!this.tags) return;

    return this.tags.sort((a, b) => {
      if (a.selected > b.selected) return -1;
      if (a.selected < b.selected) return 1;

      if (a[this.label] < b[this.label]) return -1;
      if (a[this.label] > b[this.label]) return 1;
      return 0;
    });
  }

  public onTagClicked(tag: ISelectable) {
    if (!tag) return;

    tag.selected = !tag.selected;

    this.tagClickedEvent.emit(tag);
  }

  public getSelectedTags() {
    return this.tags.filter(p => p.selected).map(p => p);
  }

  public paginacao(event) {
    this.pageIndex = event.page;
    this.pageSize = event.recordsPerPage;

    this.pagedEvent.emit({ pagina: event.page, total: event.recordsPerPage });
  }
}
