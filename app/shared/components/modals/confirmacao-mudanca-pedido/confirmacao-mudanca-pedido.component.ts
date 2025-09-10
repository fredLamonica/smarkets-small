import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmacao-mudanca-pedido',
  templateUrl: './confirmacao-mudanca-pedido.component.html',
  styleUrls: ['./confirmacao-mudanca-pedido.component.scss']
})
export class ConfirmacaoMudancaPedidoComponent implements OnInit {

  @Input() confirmacao: string;
  @Input() titulo: string = "Atenção";
  @Input() observacao: string;

  public form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.construirFormulario();
    if(this.observacao)
      this.preencherFormulario();
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      observacao: ['']
    });
  }

  private preencherFormulario() {
    this.form.patchValue({observacao: this.observacao});
  }

  public confirmar() {
    this.activeModal.close(this.form.value.observacao);
  }
}
