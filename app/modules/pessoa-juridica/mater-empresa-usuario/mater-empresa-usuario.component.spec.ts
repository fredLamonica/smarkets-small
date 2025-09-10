import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterEmpresaUsuarioComponent } from './mater-empresa-usuario.component';

describe('MaterEmpresaUsuarioComponent', () => {
  let component: MaterEmpresaUsuarioComponent;
  let fixture: ComponentFixture<MaterEmpresaUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterEmpresaUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterEmpresaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
