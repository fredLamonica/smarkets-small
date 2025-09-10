import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGmvFastComponent } from './dashboard-gmv-fast.component';

describe('DashboardGmvFastComponent', () => {
  let component: DashboardGmvFastComponent;
  let fixture: ComponentFixture<DashboardGmvFastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardGmvFastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGmvFastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
