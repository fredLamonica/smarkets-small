import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sdk-progressbar',
  templateUrl: './sdk-progressbar.component.html',
  styleUrls: ['./sdk-progressbar.component.scss']
})
export class SdkProgressbarComponent implements OnInit {
  @Input() value: number;
  @Input() maxValue: number;
  @Input() alinharDireita: boolean = true;
  @Input() label: string;

  progress: string;

  constructor() {}

  ngOnInit() {
    const resultado = (this.value / this.maxValue) * 100;
    this.progress = `${resultado}%`;
  }
}
