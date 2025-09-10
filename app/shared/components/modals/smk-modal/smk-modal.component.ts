import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Unsubscriber } from '../../base/unsubscriber';

@Component({
  selector: 'smk-modal',
  templateUrl: './smk-modal.component.html',
  styleUrls: ['./smk-modal.component.scss']
})
export class SmkModalComponent extends Unsubscriber implements OnInit, OnDestroy {

  @Input() titulo = '';
  @Input() botaoSalvarHabilitado = false;
  @Input() botaoAtualizarHabilitado = false;
  @Input() salvarLabel = ' Salvar';
  @Input() salvarBtnClass = 'btn-success';
  @Input() fecharLabel = 'Fechar';
  @Input() fecharBtnClass = 'btn-outline-primary';
  @Input() atualizarLabel = 'Atualizar';
  @Input() atualizarBtnClass = 'btn-primary';
  @Input() classAtualizarIcon = 'fas fa-edit';

  @Output("fechar") fecharEmitter = new EventEmitter();
  @Output("salvar") salvarEmitter = new EventEmitter();
  @Output("atualizar") atualizarEmitter = new EventEmitter();

  constructor(
  ) {
    super();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  salvar() {
    this.salvarEmitter.emit();
  }

  fechar() {
    this.fecharEmitter.emit();
  }

  atualizar() {
    this.atualizarEmitter.emit();
  }

}
