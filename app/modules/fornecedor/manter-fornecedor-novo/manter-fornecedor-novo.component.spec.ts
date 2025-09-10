import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterFornecedorNovoComponent } from './manter-fornecedor-novo.component';

describe('ManterFornecedorNovoComponent', () => {
  let component: ManterFornecedorNovoComponent;
  let fixture: ComponentFixture<ManterFornecedorNovoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterFornecedorNovoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterFornecedorNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
