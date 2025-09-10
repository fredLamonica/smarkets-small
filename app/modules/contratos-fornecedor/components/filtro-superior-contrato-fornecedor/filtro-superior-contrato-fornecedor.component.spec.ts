import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroSuperiorContratoFornecedorComponent } from './filtro-superior-contrato-fornecedor.component';

describe('FiltroSuperiorContratoFornecedorComponent', () => {
  let component: FiltroSuperiorContratoFornecedorComponent;
  let fixture: ComponentFixture<FiltroSuperiorContratoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroSuperiorContratoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroSuperiorContratoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
