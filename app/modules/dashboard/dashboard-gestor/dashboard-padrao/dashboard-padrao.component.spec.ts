import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPadraoComponent } from './dashboard-padrao.component';

describe('DashboardPadraoComponent', () => {
  let component: DashboardPadraoComponent;
  let fixture: ComponentFixture<DashboardPadraoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPadraoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPadraoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
