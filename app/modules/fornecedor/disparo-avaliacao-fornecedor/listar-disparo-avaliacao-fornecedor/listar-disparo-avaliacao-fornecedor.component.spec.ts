import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDisparoAvaliacaoFornecedorComponent } from './listar-disparo-avaliacao-fornecedor.component';

describe('ListarDisparoAvaliacaoFornecedorComponent', () => {
  let component: ListarDisparoAvaliacaoFornecedorComponent;
  let fixture: ComponentFixture<ListarDisparoAvaliacaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarDisparoAvaliacaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarDisparoAvaliacaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
