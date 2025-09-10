import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sdk-modal',
  templateUrl: './sdk-modal.component.html',
  styleUrls: ['./sdk-modal.component.scss']
})
export class SdkModalComponent implements OnInit {
  @Input() title: string = '';
  @Input() subtitle: string = '';

  @Input('icon-button-cancel') iconButtonCancel: string = '';
  @Input('title-button-cancel') titleButtonCancel: string = 'Cancelar';
  @Input('show-button-cancel') showButtonCancel: boolean = true;
  @Input('show-footer') hasFooter: boolean = false;
  @Input('icon-button-confirm') iconButtonConfirm: string = '';
  @Input('title-button-confirm') titleButtonConfirm: string = 'Salvar';
  @Input('show-button-confirm') showButtonConfirm: boolean = true;
  @Input() content: string;
  @Output('on-cancel') onCancel = new EventEmitter();
  @Output('on-confirm') onConfirm = new EventEmitter();

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {}

  public cancel() {
    this.onCancel.emit();
    this.activeModal.close();
  }

  confirm() {
    this.onConfirm.emit();
  }
}
