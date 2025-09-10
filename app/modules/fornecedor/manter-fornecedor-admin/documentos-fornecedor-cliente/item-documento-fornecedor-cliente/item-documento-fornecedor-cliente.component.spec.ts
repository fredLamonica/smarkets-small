/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ItemDocumentoFornecedorClienteComponent } from './item-documento-fornecedor-cliente.component';

describe('ItemDocumentoFornecedorClienteComponent', () => {
  let component: ItemDocumentoFornecedorClienteComponent;
  let fixture: ComponentFixture<ItemDocumentoFornecedorClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDocumentoFornecedorClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDocumentoFornecedorClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
