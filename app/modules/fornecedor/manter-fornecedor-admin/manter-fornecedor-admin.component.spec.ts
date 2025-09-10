import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterFornecedorAdminComponent } from './manter-fornecedor-admin.component';

describe('ManterFornecedorNovoGestorComponent', () => {
  let component: ManterFornecedorAdminComponent;
  let fixture: ComponentFixture<ManterFornecedorAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManterFornecedorAdminComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterFornecedorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
