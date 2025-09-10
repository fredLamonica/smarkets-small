import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarRequisicoesNaoFinalizadasComponent } from './listar-requisicoes-nao-finalizadas.component';

describe('ListarRequisicoesNaoFinalizadasComponent', () => {
  let component: ListarRequisicoesNaoFinalizadasComponent;
  let fixture: ComponentFixture<ListarRequisicoesNaoFinalizadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarRequisicoesNaoFinalizadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarRequisicoesNaoFinalizadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
