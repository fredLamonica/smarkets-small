import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAprovadorComponent } from './dashboard-aprovador.component';

describe('DashboardAprovadorComponent', () => {
  let component: DashboardAprovadorComponent;
  let fixture: ComponentFixture<DashboardAprovadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAprovadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAprovadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
