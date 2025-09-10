import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarFornecedorComponent } from './selecionar-fornecedor.component';

describe('SelecionarFornecedorComponent', () => {
  let component: SelecionarFornecedorComponent;
  let fixture: ComponentFixture<SelecionarFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecionarFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionarFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
