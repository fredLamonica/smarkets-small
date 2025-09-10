import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlanoAcaoFornecedorComponent } from './listar-plano-acao-fornecedor.component';

describe('ListarPlanoAcaoFornecedorComponent', () => {
  let component: ListarPlanoAcaoFornecedorComponent;
  let fixture: ComponentFixture<ListarPlanoAcaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarPlanoAcaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPlanoAcaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
