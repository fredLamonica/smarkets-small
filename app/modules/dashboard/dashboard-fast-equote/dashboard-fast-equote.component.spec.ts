import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFastEquoteComponent } from './dashboard-fast-equote.component';

describe('DashboardFastEquoteComponent', () => {
  let component: DashboardFastEquoteComponent;
  let fixture: ComponentFixture<DashboardFastEquoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFastEquoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFastEquoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
