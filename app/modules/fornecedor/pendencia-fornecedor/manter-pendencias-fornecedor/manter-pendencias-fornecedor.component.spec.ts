import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterPendenciasFornecedorComponent } from './manter-pendencias-fornecedor.component';

describe('ManterPendenciasFornecedorComponent', () => {
  let component: ManterPendenciasFornecedorComponent;
  let fixture: ComponentFixture<ManterPendenciasFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterPendenciasFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterPendenciasFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
