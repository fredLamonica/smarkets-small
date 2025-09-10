import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarContratosCatalogoComponent } from './selecionar-contratos-catalogo.component';

describe('SelecionarContratosCatalogoComponent', () => {
  let component: SelecionarContratosCatalogoComponent;
  let fixture: ComponentFixture<SelecionarContratosCatalogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecionarContratosCatalogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionarContratosCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
