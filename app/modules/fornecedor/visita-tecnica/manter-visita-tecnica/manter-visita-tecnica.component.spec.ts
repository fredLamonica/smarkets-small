import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterVisitaTecnicaComponent } from './manter-visita-tecnica.component';

describe('ManterVisitaTecnicaComponent', () => {
  let component: ManterVisitaTecnicaComponent;
  let fixture: ComponentFixture<ManterVisitaTecnicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterVisitaTecnicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterVisitaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
