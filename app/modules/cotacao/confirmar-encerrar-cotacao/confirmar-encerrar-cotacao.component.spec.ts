import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarEncerrarCotacaoComponent } from './confirmar-encerrar-cotacao.component';

describe('ConfirmarEncerrarCotacaoComponent', () => {
  let component: ConfirmarEncerrarCotacaoComponent;
  let fixture: ComponentFixture<ConfirmarEncerrarCotacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarEncerrarCotacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarEncerrarCotacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
