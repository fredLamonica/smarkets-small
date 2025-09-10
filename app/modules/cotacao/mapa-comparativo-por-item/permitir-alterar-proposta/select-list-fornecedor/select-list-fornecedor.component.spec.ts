import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectListFornecedorComponent } from './select-list-fornecedor.component';

describe('SelectListFornecedorComponent', () => {
  let component: SelectListFornecedorComponent;
  let fixture: ComponentFixture<SelectListFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectListFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectListFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
