import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarMotivoDesclassificacaoComponent } from './listar-motivo-desclassificacao.component';

describe('ListarMotivoDesclassificacaoComponent', () => {
  let component: ListarMotivoDesclassificacaoComponent;
  let fixture: ComponentFixture<ListarMotivoDesclassificacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarMotivoDesclassificacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarMotivoDesclassificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
