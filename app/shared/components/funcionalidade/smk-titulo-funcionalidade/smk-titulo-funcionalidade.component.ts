import { Component, Input, OnInit } from '@angular/core';
import { SmkComponent } from '../base/smk-component';

@Component({
  selector: 'smk-titulo-funcionalidade',
  templateUrl: './smk-titulo-funcionalidade.component.html',
  styleUrls: ['./smk-titulo-funcionalidade.component.scss'],
})
export class SmkTituloFuncionalidadeComponent extends SmkComponent implements OnInit {

  @Input() titulo: string;
  @Input() tituloComplementar: string;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
