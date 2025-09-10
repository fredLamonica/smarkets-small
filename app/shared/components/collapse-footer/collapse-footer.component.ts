import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'collapse-footer',
  templateUrl: './collapse-footer.component.html',
  styleUrls: ['./collapse-footer.component.scss']
})
export class CollapseFooterComponent implements OnInit {

  public componentId: string = '_' + Math.random().toString(36).substr(2, 9);

  @Output("open") openEmitter = new EventEmitter();

  private collapsed: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  public action() {
    this.collapsed = !this.collapsed;

    if(!this.collapsed)
      this.openEmitter.emit();
  }

}
