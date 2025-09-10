/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManterUsuarioFornecedorComponent } from './manter-usuario-fornecedor.component';

describe('ManterUsuarioFornecedorComponent', () => {
  let component: ManterUsuarioFornecedorComponent;
  let fixture: ComponentFixture<ManterUsuarioFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterUsuarioFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterUsuarioFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
