import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterDisparoAvaliacaoFornecedorComponent } from './manter-disparo-avaliacao-fornecedor.component';

describe('ManterDisparoAvaliacaoFornecedorComponent', () => {
  let component: ManterDisparoAvaliacaoFornecedorComponent;
  let fixture: ComponentFixture<ManterDisparoAvaliacaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManterDisparoAvaliacaoFornecedorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterDisparoAvaliacaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
