/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCargaEmpresasComponent } from './listar-carga-empresas.component';

describe('ListarCargaEmpresasComponent', () => {
  let component: ListarCargaEmpresasComponent;
  let fixture: ComponentFixture<ListarCargaEmpresasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListarCargaEmpresasComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCargaEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
