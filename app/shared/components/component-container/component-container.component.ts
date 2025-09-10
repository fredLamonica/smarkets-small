import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'smk-component-container',
  templateUrl: './component-container.component.html',
  styleUrls: ['./component-container.component.scss'],
})
export class ComponentContainerComponent implements OnInit {
  @Input() componentSelector: string;
  @Input() compromisedConsistency: boolean;
  @Input() loading: boolean;

  constructor() { }

  ngOnInit() {
  }

}
