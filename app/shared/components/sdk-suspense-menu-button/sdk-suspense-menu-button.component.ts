import { Component, ContentChild, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { SdkSuspenseMenu } from './sdk-suspense-menu.directive';

@Component({
  selector: 'sdk-suspense-menu-button',
  templateUrl: './sdk-suspense-menu-button.component.html',
  styleUrls: ['./sdk-suspense-menu-button.component.scss'],
})
export class SdkSuspenseMenuButtonComponent implements OnInit {

  @ContentChild(SdkSuspenseMenu, { read: TemplateRef }) suspenseMenuTemplate;

  @Input() icon: string = 'fa fa-clone';
  @Input() title: string = '';

  suspenseOpened: boolean = false;
  private clickedInside: boolean = false;
  constructor() { }

  ngOnInit() { }

  suspense(event: Event, opened: boolean) {
    this.suspenseOpened = opened;
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('click')
  clickInside() {
    this.clickedInside = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.clickedInside) {
      this.suspenseOpened = false;
    }
    this.clickedInside = false;
  }
}
