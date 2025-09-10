import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[customColumn]'
})
export class CustomColumnDirective {
  @Input() customColumn!: string;

  constructor(public templateRef: TemplateRef<any>) {}
}
