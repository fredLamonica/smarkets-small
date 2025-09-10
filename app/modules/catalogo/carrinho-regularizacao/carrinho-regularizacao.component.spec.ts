import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarrinhoRegularizacaoComponent } from './carrinho-regularizacao.component';

describe('CarrinhoRegularizacaoComponent', () => {
  let component: CarrinhoRegularizacaoComponent;
  let fixture: ComponentFixture<CarrinhoRegularizacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CarrinhoRegularizacaoComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrinhoRegularizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
