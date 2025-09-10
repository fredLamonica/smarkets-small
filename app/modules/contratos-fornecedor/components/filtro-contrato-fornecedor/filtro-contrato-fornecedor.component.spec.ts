import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroContratoFornecedorComponent } from './filtro-contrato-fornecedor.component';

describe('FiltroContratoFornecedorComponent', () => {
  let component: FiltroContratoFornecedorComponent;
  let fixture: ComponentFixture<FiltroContratoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroContratoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroContratoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
