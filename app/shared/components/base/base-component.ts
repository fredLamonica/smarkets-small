import { ChangeDetectorRef, ElementRef, Injectable, Injector, Type } from '@angular/core';
import { Unsubscriber } from './unsubscriber';

@Injectable()
export abstract class BaseComponent extends Unsubscriber {
  componentSelector: string;
  compromisedConsistency: boolean;

  protected changeDetectorRef: ChangeDetectorRef = this.injectorEngine.get(ChangeDetectorRef as Type<ChangeDetectorRef>);
  protected elementRef: ElementRef = this.injectorEngine.get(ElementRef as Type<ElementRef>);

  constructor(private injectorEngine: Injector) {
    super();
    this.componentSelector = this.elementRef.nativeElement.tagName.toLowerCase();
  }

  /**
   * Throw generic consistency error.
   * @param errorMessage The error message.
   */
  protected throwError(errorMessage: string): void {
    this.compromisedConsistency = true;
    this.changeDetectorRef.detectChanges();
    throw new Error(`<${this.componentSelector}> - ${errorMessage}`);
  }
}
