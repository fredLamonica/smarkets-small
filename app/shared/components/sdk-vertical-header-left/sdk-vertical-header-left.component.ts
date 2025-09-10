import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sdk-vertical-header-left',
  templateUrl: './sdk-vertical-header-left.component.html',
  styleUrls: ['./sdk-vertical-header-left.component.css']
})
export class SdkVerticalHeaderLeftComponent implements OnInit {

  // Evento para notificar o componente pai, o salvamento dos seus componentes irmãos.
  @Output()
  private onSave: EventEmitter<any> = new EventEmitter();

  constructor(private element: ElementRef) { }

  ngOnInit() {
  }

  public Save(e: Event) {
    this.onSave.emit(e);
  }
}
