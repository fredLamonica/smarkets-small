import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarCartaResponsabilidadeFornecedorComponent } from './enviar-carta-responsabilidade-fornecedor.component';

describe('EnviarCartaResponsabilidadeFornecedorComponent', () => {
  let component: EnviarCartaResponsabilidadeFornecedorComponent;
  let fixture: ComponentFixture<EnviarCartaResponsabilidadeFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviarCartaResponsabilidadeFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviarCartaResponsabilidadeFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
