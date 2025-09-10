import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarRequisicoesComponent } from './listar-requisicoes.component';

describe('ListarRequisicoesComponent', () => {
  let component: ListarRequisicoesComponent;
  let fixture: ComponentFixture<ListarRequisicoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarRequisicoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarRequisicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
