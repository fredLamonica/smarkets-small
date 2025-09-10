import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEmpresaUsuarioComponent } from './listar-empresa-usuario.component';

describe('ListarEmpresaUsuarioComponent', () => {
  let component: ListarEmpresaUsuarioComponent;
  let fixture: ComponentFixture<ListarEmpresaUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarEmpresaUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarEmpresaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
