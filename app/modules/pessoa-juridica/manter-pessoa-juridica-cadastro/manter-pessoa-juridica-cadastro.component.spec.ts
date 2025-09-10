import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterPessoaJuridicaCadastroComponent } from './manter-pessoa-juridica-cadastro.component';

describe('ManterPessoaJuridicaCadastroComponent', () => {
  let component: ManterPessoaJuridicaCadastroComponent;
  let fixture: ComponentFixture<ManterPessoaJuridicaCadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterPessoaJuridicaCadastroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterPessoaJuridicaCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
