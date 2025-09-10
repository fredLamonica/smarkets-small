import { Directive, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[click-prevent-default]',
})
export class ClickPreventDefaultDirective {

  @HostListener('click', ['$event'])
  onClick(event: any): void {
    event.preventDefault();
  }

}
