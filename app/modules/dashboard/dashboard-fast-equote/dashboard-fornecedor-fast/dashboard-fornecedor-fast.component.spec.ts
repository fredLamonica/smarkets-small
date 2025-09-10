import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFornecedorFastComponent } from './dashboard-fornecedor-fast.component';

describe('DashboardFornecedorFastComponent', () => {
  let component: DashboardFornecedorFastComponent;
  let fixture: ComponentFixture<DashboardFornecedorFastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFornecedorFastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFornecedorFastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
