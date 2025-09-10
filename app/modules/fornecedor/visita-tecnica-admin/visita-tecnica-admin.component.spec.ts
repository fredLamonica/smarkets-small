import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitaTecnicaAdminComponent } from './visita-tecnica-admin.component';

describe('VisitaTecnicaFornecedorComponent', () => {
  let component: VisitaTecnicaAdminComponent;
  let fixture: ComponentFixture<VisitaTecnicaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisitaTecnicaAdminComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitaTecnicaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
