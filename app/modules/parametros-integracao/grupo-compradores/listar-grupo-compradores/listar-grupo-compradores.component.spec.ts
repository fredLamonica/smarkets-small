import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarGrupoCompradoresComponent } from './listar-grupo-compradores.component';

describe('ListarGrupoCompradoresComponent', () => {
  let component: ListarGrupoCompradoresComponent;
  let fixture: ComponentFixture<ListarGrupoCompradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarGrupoCompradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarGrupoCompradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
