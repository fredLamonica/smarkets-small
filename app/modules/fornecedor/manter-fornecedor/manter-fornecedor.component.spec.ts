import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterFornecedorComponent } from './manter-fornecedor.component';

describe('ManterFornecedorComponent', () => {
  let component: ManterFornecedorComponent;
  let fixture: ComponentFixture<ManterFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
