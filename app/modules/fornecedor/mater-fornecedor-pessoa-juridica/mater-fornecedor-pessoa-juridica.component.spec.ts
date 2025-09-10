import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterFornecedorPessoaJuridicaComponent } from './mater-fornecedor-pessoa-juridica.component';

describe('MaterFornecedorPessoaJuridicaComponent', () => {
  let component: MaterFornecedorPessoaJuridicaComponent;
  let fixture: ComponentFixture<MaterFornecedorPessoaJuridicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterFornecedorPessoaJuridicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterFornecedorPessoaJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
