import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'auto-save-label',
  templateUrl: './auto-save-label.component.html',
  styleUrls: ['./auto-save-label.component.scss']
})
export class AutoSaveLabelComponent implements OnInit {
  
  @Input('ultima-alteracao') ultimaAlteracao: string;
  
  constructor() { }

  ngOnInit() {
  }
}
