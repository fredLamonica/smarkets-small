import { Component, Input } from '@angular/core';

@Component({
  selector: 'sdk-generic-header-page',
  templateUrl: './sdk-generic-header-page.component.html',
  styleUrls: ['./sdk-generic-header-page.component.scss']
})
export class SdkGenericHeaderPageComponent {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() titleClass: string;
  @Input() subTitleClass: string; 
  

}
