import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarOutroFornecedorComponent } from './selecionar-outro-fornecedor.component';

describe('SelecionarOutroFornecedorComponent', () => {
  let component: SelecionarOutroFornecedorComponent;
  let fixture: ComponentFixture<SelecionarOutroFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecionarOutroFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionarOutroFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
