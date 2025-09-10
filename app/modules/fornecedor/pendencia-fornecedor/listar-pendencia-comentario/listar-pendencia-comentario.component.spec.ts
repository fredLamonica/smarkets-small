import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPendenciaComentarioComponent } from './listar-pendencia-comentario.component';

describe('ListarPendenciaComentarioComponent', () => {
  let component: ListarPendenciaComentarioComponent;
  let fixture: ComponentFixture<ListarPendenciaComentarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarPendenciaComentarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPendenciaComentarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
