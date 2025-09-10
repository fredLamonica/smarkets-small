import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarComentarioPlanoAcaoComponent } from './listar-comentario-plano-acao.component';

describe('ListarComentarioPlanoAcaoComponent', () => {
  let component: ListarComentarioPlanoAcaoComponent;
  let fixture: ComponentFixture<ListarComentarioPlanoAcaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarComentarioPlanoAcaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarComentarioPlanoAcaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
