import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SmkComponent } from '../base/smk-component';

@Component({
  selector: 'smk-barra-acoes-funcionalidade',
  templateUrl: './smk-barra-acoes-funcionalidade.component.html',
  styleUrls: ['./smk-barra-acoes-funcionalidade.component.scss'],
})
export class SmkBarraAcoesFuncionalidadeComponent extends SmkComponent implements OnInit {

  @Input() rotaVoltar: string;

  constructor(private location: Location, private router: Router) {
    super();
  }

  ngOnInit() {
  }

  volte(): void {
    if (this.rotaVoltar) {
      this.router.navigate([this.rotaVoltar]);
    } else {
      this.location.back();
    }
  }

}
