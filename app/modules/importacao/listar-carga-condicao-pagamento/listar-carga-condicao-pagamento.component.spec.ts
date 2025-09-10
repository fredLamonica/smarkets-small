/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListarCargaCondicaoPagamentoComponent } from './listar-carga-condicao-pagamento.component';

describe('ListarCargaCondicaoPagamentoComponent', () => {
  let component: ListarCargaCondicaoPagamentoComponent;
  let fixture: ComponentFixture<ListarCargaCondicaoPagamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarCargaCondicaoPagamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCargaCondicaoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
