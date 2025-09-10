import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MfaComponent } from './mfa/mfa.component';
import { PinCodeComponent } from './pin-code/pin-code.component';
import { RecoveryCodeComponent } from './recovery-code/recovery-code.component';

const routes: Routes = [
  {
    path: '',
    component: MfaComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'pin-code' },
      { path: 'pin-code/:token', component: PinCodeComponent /* canActivate: [PermissaoGuard] */ },
      { path: 'recovery-code/:token', component: RecoveryCodeComponent /* canActivate: [PermissaoGuard] */ },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MfaRoutingModule { }
