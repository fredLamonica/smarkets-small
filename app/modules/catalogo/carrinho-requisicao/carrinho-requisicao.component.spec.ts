import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrinhoRequisicaoComponent } from './carrinho-requisicao.component';

describe('CarrinhoRequisicaoComponent', () => {
  let component: CarrinhoRequisicaoComponent;
  let fixture: ComponentFixture<CarrinhoRequisicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrinhoRequisicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrinhoRequisicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
