import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'select-multiple-option-panel',
  templateUrl: './select-multiple-option-painel.component.html',
  styleUrls: ['./select-multiple-option-painel.component.scss']
})
export class SelectMultipleOptionPainelComponent implements OnInit {

 @Output() readonly updateValueEmitter: EventEmitter<any> = new EventEmitter();

  itens: any[];
  itensPreCarregados = true;

  todosSelecionados = false;

  constructor() { }

  ngOnInit() {
  }

  selecioneTodos() {
    const novoValor = this.itens.some((item) => !item.selecionado)

    this.itens.forEach(
        (item) => {
          item.selecionado = novoValor;
        }
      )

    this.todosSelecionados = novoValor;
    this.atualizeValor();
  }

  selecioneOpcao(valor: any) {
    if (this.itensPreCarregados) {
      const itemClicado = this.itens.find((item) => item.valor === valor);
      itemClicado.selecionado = !itemClicado.selecionado;
      this.todosSelecionados = this.itens.every((item) => item.selecionado);
    } else {
      const index = this.itens.findIndex((item) => item.valor === valor);
      this.itens.splice(index, 1);
    }

    this.atualizeValor();
  }

  atualizeValor() {
    this.updateValueEmitter.emit();
  }

}
