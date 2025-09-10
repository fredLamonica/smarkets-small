import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCondicaoPagamentoComponent } from './manter-condicao-pagamento.component';

describe('ManterCondicaoPagamentoComponent', () => {
  let component: ManterCondicaoPagamentoComponent;
  let fixture: ComponentFixture<ManterCondicaoPagamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCondicaoPagamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCondicaoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
