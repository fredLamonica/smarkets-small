import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUsuarioFastComponent } from './dashboard-usuario-fast.component';

describe('DashboardUsuarioFastComponent', () => {
  let component: DashboardUsuarioFastComponent;
  let fixture: ComponentFixture<DashboardUsuarioFastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardUsuarioFastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardUsuarioFastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
