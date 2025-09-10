import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCargaInformacaoContratosComponent } from './listar-carga-informacao-contratos.component';

describe('ListarCargaInformacaoContratosComponent', () => {
  let component: ListarCargaInformacaoContratosComponent;
  let fixture: ComponentFixture<ListarCargaInformacaoContratosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListarCargaInformacaoContratosComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCargaInformacaoContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
