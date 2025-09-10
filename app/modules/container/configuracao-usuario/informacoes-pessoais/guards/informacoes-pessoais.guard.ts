import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { InformacoesPessoaisComponent } from '../informacoes-pessoais.component';

@Injectable({
  providedIn: 'root',
})
export class InformacoesPessoaisGuard implements CanDeactivate<InformacoesPessoaisComponent> {
  canDeactivate(
    component: InformacoesPessoaisComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate();
  }
}
