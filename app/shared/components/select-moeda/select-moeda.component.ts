import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Moeda } from '@shared/models';

@Component({
  selector: 'select-moeda',
  templateUrl: './select-moeda.component.html',
  styleUrls: ['./select-moeda.component.scss']
})
export class SelectMoedaComponent implements OnInit {

  @Input() moeda: Moeda;
  @Input('read-only') readOnly: boolean = false;
  @Output() change = new EventEmitter<Moeda>();

  public moedaKeys = [];
  public moedaEnum = Moeda;
  public moedaKey = null;

  constructor() {
    this.moedaKeys = Object.keys(Moeda).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );

   }

  ngOnInit() {
    if(this.moeda){
      this.moedaKey = Moeda[this.moeda];
    }
  }

  public mudarMoeda(event){
    this.moedaKey = event;

    if(this.change){
      this.change.emit((<any>Moeda)[this.moedaEnum[event]]);
    }
  }
}
