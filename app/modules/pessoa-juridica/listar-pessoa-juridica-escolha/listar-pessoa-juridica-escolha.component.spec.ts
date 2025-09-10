import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPessoaJuridicaEscolhaComponent } from './listar-pessoa-juridica-escolha.component';

describe('ListarPessoaJuridicaEscolhaComponent', () => {
  let component: ListarPessoaJuridicaEscolhaComponent;
  let fixture: ComponentFixture<ListarPessoaJuridicaEscolhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarPessoaJuridicaEscolhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPessoaJuridicaEscolhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
