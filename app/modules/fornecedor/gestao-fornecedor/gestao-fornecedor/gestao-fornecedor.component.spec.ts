import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoFornecedorComponent } from './gestao-fornecedor.component';

describe('GestaoFornecedorComponent', () => {
  let component: GestaoFornecedorComponent;
  let fixture: ComponentFixture<GestaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestaoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
