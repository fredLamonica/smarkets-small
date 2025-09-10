import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  CartaResponsabilidadeFornecedor,
  SituacaoCartaResponsabilidadeFornecedorLabel
} from '@shared/models';

@Component({
  selector: 'app-item-carta-responsabilidade',
  templateUrl: './item-carta-responsabilidade.component.html',
  styleUrls: ['./item-carta-responsabilidade.component.scss']
})
export class ItemCartaResponsabilidadeComponent implements OnInit {
  @Input() carta: CartaResponsabilidadeFornecedor;
  @Output() event = new EventEmitter();
  public situacao = SituacaoCartaResponsabilidadeFornecedorLabel;
  constructor() {}

  ngOnInit() {}

  public statusLabel() {}

  public editarCarta() {
    this.event.emit(this.carta);
  }
}
