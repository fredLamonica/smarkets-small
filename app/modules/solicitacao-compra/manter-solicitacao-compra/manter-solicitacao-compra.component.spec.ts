import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterSolicitacaoCompraComponent } from './manter-solicitacao-compra.component';

describe('ManterSolicitacaoCompraComponent', () => {
  let component: ManterSolicitacaoCompraComponent;
  let fixture: ComponentFixture<ManterSolicitacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterSolicitacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterSolicitacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
