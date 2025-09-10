import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFornecedorCategoriaComponent } from './dashboard-fornecedor-categoria.component';

describe('DashboardFornecedorCategoriaComponent', () => {
  let component: DashboardFornecedorCategoriaComponent;
  let fixture: ComponentFixture<DashboardFornecedorCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFornecedorCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFornecedorCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
