import { Component, Input, OnInit } from '@angular/core';
import { SmkComponent } from '../base/smk-component';

@Component({
  selector: 'smk-funcionalidade',
  templateUrl: './smk-funcionalidade.component.html',
  styleUrls: ['./smk-funcionalidade.component.scss'],
})
export class SmkFuncionalidadeComponent extends SmkComponent implements OnInit {

  @Input() rotaVoltar: string;
  @Input() titulo: string;
  @Input() tituloComplementar: string;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
