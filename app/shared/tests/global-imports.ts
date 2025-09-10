import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { BlockUIModule } from 'ng-block-ui';
import { ToastrModule } from 'ngx-toastr';

export const globalImports = [
  HttpClientTestingModule,
  RouterTestingModule,
  BlockUIModule,
  FormsModule,
  ReactiveFormsModule,
  TextMaskModule,
  ToastrModule.forRoot(),
  NgbModule,
];
