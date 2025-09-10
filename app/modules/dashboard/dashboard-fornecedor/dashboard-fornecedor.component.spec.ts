import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFornecedorComponent } from './dashboard-fornecedor.component';

describe('DashboardFornecedorComponent', () => {
  let component: DashboardFornecedorComponent;
  let fixture: ComponentFixture<DashboardFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
