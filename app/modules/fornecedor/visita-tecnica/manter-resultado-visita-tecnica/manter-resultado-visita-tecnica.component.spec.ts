import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterResultadoVisitaTecnicaComponent } from './manter-resultado-visita-tecnica.component';

describe('ManterResultadoVisitaTecnicaComponent', () => {
  let component: ManterResultadoVisitaTecnicaComponent;
  let fixture: ComponentFixture<ManterResultadoVisitaTecnicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterResultadoVisitaTecnicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterResultadoVisitaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
