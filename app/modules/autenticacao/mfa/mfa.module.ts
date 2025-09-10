import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { MfaRoutingModule } from './mfa-routing.module';
import { MfaComponent } from './mfa/mfa.component';
import { PinCodeComponent } from './pin-code/pin-code.component';
import { RecoveryCodeComponent } from './recovery-code/recovery-code.component';

@NgModule({
  declarations: [MfaComponent, PinCodeComponent, RecoveryCodeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextMaskModule,
    MfaRoutingModule,
  ],
})
export class MfaModule { }
