import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterGrupoCompradoresComponent } from './manter-grupo-compradores.component';

describe('ManterGrupoCompradoresComponent', () => {
  let component: ManterGrupoCompradoresComponent;
  let fixture: ComponentFixture<ManterGrupoCompradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterGrupoCompradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterGrupoCompradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
