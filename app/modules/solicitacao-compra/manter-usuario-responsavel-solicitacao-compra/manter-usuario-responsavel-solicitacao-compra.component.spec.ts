import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterUsuarioResponsavelSolicitacaoCompraComponent } from './manter-usuario-responsavel-solicitacao-compra.component';

describe('ManterUsuarioResponsavelSolicitacaoCompraComponent', () => {
  let component: ManterUsuarioResponsavelSolicitacaoCompraComponent;
  let fixture: ComponentFixture<ManterUsuarioResponsavelSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterUsuarioResponsavelSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterUsuarioResponsavelSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
