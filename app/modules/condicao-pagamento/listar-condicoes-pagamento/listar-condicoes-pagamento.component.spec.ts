import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCondicoesPagamentoComponent } from './listar-condicoes-pagamento.component';

describe('ListarCondicoesPagamentoComponent', () => {
  let component: ListarCondicoesPagamentoComponent;
  let fixture: ComponentFixture<ListarCondicoesPagamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarCondicoesPagamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCondicoesPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
