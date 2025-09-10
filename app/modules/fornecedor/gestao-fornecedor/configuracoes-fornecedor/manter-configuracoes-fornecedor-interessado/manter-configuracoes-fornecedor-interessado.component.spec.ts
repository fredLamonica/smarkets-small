import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterConfiguracoesFornecedorInteressadoComponent } from './manter-configuracoes-fornecedor-interessado.component';

describe('ManterConfiguracoesFornecedorInteressadoComponent', () => {
  let component: ManterConfiguracoesFornecedorInteressadoComponent;
  let fixture: ComponentFixture<ManterConfiguracoesFornecedorInteressadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterConfiguracoesFornecedorInteressadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterConfiguracoesFornecedorInteressadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
