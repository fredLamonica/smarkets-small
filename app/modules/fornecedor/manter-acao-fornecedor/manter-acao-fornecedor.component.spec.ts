import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterAcaoFornecedorComponent } from './manter-acao-fornecedor.component';

describe('ManterAcaoFornecedorComponent', () => {
  let component: ManterAcaoFornecedorComponent;
  let fixture: ComponentFixture<ManterAcaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterAcaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterAcaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
