import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFornecedorStatusComponent } from './dashboard-fornecedor-status.component';

describe('DashboardFornecedorStatusComponent', () => {
  let component: DashboardFornecedorStatusComponent;
  let fixture: ComponentFixture<DashboardFornecedorStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFornecedorStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFornecedorStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
