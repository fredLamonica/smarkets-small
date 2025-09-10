import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanosAcaoFornecedorComponent } from './planos-acao-fornecedor.component';

describe('PlanosAcaoFornecedorComponent', () => {
  let component: PlanosAcaoFornecedorComponent;
  let fixture: ComponentFixture<PlanosAcaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanosAcaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanosAcaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
