import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGestorComponent } from './dashboard-gestor.component';

describe('DashboardGestorComponent', () => {
  let component: DashboardGestorComponent;
  let fixture: ComponentFixture<DashboardGestorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardGestorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
