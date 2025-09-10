import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTransactionFastComponent } from './dashboard-transaction-fast.component';

describe('DashboardTransactionFastComponent', () => {
  let component: DashboardTransactionFastComponent;
  let fixture: ComponentFixture<DashboardTransactionFastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTransactionFastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTransactionFastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
