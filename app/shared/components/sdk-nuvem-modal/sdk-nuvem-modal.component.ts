import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'sdk-nuvem-modal',
  templateUrl: './sdk-nuvem-modal.component.html',
  styleUrls: ['./sdk-nuvem-modal.component.scss']
})
export class SdkNuvemModalComponent implements OnInit {
  @Input() title: string;

  @Input() tags: Array<any>;
  @Input() label: string;
  @Input() key: string;
  @Input() onConfirmChanges = new EventEmitter<Array<any>>();

  @Input() pageIndex: number = 1;
  @Input() pageSize: number = 50;
  @Input() totalPages: number = 0;

  @Output() pagedEvent = new EventEmitter<any>();

  public selectedTagsToSave: Array<any>;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  public page(event) {
    this.pagedEvent.emit(event);
  }

  public updateSelectedTags(newTags) {
    this.selectedTagsToSave = newTags;
  }

  public onConfirm() {
    this.activeModal.close(this.selectedTagsToSave);
  }
}
