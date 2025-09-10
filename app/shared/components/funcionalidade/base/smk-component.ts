import { Input, OnDestroy, OnInit } from '@angular/core';
import { Unsubscriber } from '../../base/unsubscriber';

export abstract class SmkComponent extends Unsubscriber implements OnInit, OnDestroy {

  @Input() class: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
