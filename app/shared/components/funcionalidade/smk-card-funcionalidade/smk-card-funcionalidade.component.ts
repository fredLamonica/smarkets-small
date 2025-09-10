import { Component, Input, OnInit } from '@angular/core';
import { SmkComponent } from '../base/smk-component';

@Component({
  selector: 'smk-card-funcionalidade',
  templateUrl: './smk-card-funcionalidade.component.html',
  styleUrls: ['./smk-card-funcionalidade.component.scss'],
})
export class SmkCardFuncionalidadeComponent extends SmkComponent implements OnInit {

  @Input() titulo: string;
  @Input() padding: string;
  @Input() paddingTop: string;
  @Input() paddingRight: string;
  @Input() paddingBottom: string;
  @Input() paddingLeft: string;
  @Input() border: string;

  style: any = {};

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.padding) {
      this.style['padding'] = this.padding;
    } else {
      if (this.paddingTop) {
        this.style['padding-top'] = this.paddingTop;
      }

      if (this.paddingRight) {
        this.style['padding-right'] = this.paddingRight;
      }

      if (this.paddingBottom) {
        this.style['padding-bottom'] = this.paddingBottom;
      }

      if (this.paddingLeft) {
        this.style['padding-left'] = this.paddingLeft;
      }
    }

    if (this.border) {
      this.style['border'] = this.border;
    }
  }

}
