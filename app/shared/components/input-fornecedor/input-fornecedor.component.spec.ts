import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFornecedorComponent } from './input-fornecedor.component';

describe('InputFornecedorComponent', () => {
  let component: InputFornecedorComponent;
  let fixture: ComponentFixture<InputFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
