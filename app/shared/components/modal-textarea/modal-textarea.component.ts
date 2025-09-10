import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'smk-modal-textarea',
  templateUrl: './modal-textarea.component.html',
  styleUrls: ['./modal-textarea.component.scss'],
})
export class ModalTextAreaComponent implements OnInit {
  textoCabecalho: string;
  inputTextArea: string = '';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() { }

  cancelar() {
    this.activeModal.close(false);
  }

  confirmar() {
    if (!this.isEmpty(this.inputTextArea)) {
      this.activeModal.close(this.inputTextArea);
    }
  }

  isEmpty(entrada: string) {
    return !entrada || 0 === entrada.length || entrada.match(/^ *$/) !== null;
  }
}
