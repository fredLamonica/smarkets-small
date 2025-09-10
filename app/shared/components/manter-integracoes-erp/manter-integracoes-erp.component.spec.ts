import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManterIntegracoesErpComponent } from './manter-integracoes-erp.component';

describe('ManterProdutoIntegracoesErpComponent', () => {
  let component: ManterIntegracoesErpComponent;
  let fixture: ComponentFixture<ManterIntegracoesErpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterIntegracoesErpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterIntegracoesErpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
