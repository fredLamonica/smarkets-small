import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadMenuService {
  reloadMenuObserver : Observable<number>;
  private reloadMenuMessenger : Subject<number> = new Subject<number>();

  constructor() {
    this.reloadMenuObserver = this.reloadMenuMessenger.asObservable();
   }

   reloadMenu(idSolicitacao): void{
      this.reloadMenuMessenger.next(idSolicitacao);
   }

}
