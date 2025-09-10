import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventoBuscarService {
  public evento : EventEmitter<any> = new EventEmitter<any>()
}
