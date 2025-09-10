import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Unsubscriber } from '../../base/unsubscriber';

@Component({
  selector: 'smk-recusa-aprovacao-contrato-fornecedor',
  templateUrl: './recusa-aprovacao-contrato-fornecedor.component.html',
  styleUrls: ['./recusa-aprovacao-contrato-fornecedor.component.scss']
})
export class RecusaAprovacaoContratoFornecedorComponent extends Unsubscriber implements OnInit {

   @BlockUI() blockUI: NgBlockUI;

  formRecusaContrato: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
  ) {
    super();
  }

  ngOnInit() {
    this.formRecusaContrato = this.fb.group({
      motivoRecusa: [null],
    });
  }

  salvar(){
     this.activeModal.close(this.formRecusaContrato.controls.motivoRecusa)
  }

  fechar(op: boolean) {
    this.activeModal.close(op);
  }

}
