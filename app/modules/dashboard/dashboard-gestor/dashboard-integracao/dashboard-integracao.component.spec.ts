import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardIntegracaoComponent } from './dashboard-integracao.component';

describe('DashboardIntegracaoComponent', () => {
  let component: DashboardIntegracaoComponent;
  let fixture: ComponentFixture<DashboardIntegracaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardIntegracaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardIntegracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
