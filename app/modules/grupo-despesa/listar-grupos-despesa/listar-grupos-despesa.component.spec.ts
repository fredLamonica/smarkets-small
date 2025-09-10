import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarGruposDespesaComponent } from './listar-grupos-despesa.component';

describe('ListarGruposDespesaComponent', () => {
  let component: ListarGruposDespesaComponent;
  let fixture: ComponentFixture<ListarGruposDespesaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarGruposDespesaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarGruposDespesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
