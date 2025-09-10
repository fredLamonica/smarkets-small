import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'input-busca',
  templateUrl: './input-busca.component.html',
  styleUrls: ['./input-busca.component.scss']
})
export class InputBuscaComponent implements OnInit {
  
  @Input() termo: string = "";
  @Input() placeholder: string = "";
  @Input() label: string;
  @Input() disabled: boolean = false;
  
  @Output("campoVazio") campoVazioEmitter: EventEmitter<any> = new EventEmitter();
  @Output("buscar") buscarEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  public buscar() {
    this.buscarEmitter.emit(this.termo);
  }

  public onKeyUp(){
    if (!this.termo || this.termo.length == 0){
      this.campoVazioEmitter.emit(this.termo);
    }
  }

}
