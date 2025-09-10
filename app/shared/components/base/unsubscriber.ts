import { OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class Unsubscriber implements OnInit, OnDestroy {

  protected unsubscribe: Subject<void> = new Subject<void>();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
