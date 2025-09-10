import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterPlanoAcaoFornecedorComponent } from './manter-plano-acao-fornecedor.component';

describe('ManterPlanoAcaoFornecedorComponent', () => {
  let component: ManterPlanoAcaoFornecedorComponent;
  let fixture: ComponentFixture<ManterPlanoAcaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterPlanoAcaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterPlanoAcaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
