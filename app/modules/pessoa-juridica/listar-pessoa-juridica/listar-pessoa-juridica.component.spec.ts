import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPessoaJuridicaComponent } from './listar-pessoa-juridica.component';

describe('ListarPessoaJuridicaComponent', () => {
  let component: ListarPessoaJuridicaComponent;
  let fixture: ComponentFixture<ListarPessoaJuridicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarPessoaJuridicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPessoaJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
