import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterDocumentoFornecedorComponent } from './manter-documento-fornecedor.component';

describe('ManterDocumentoFornecedorComponent', () => {
  let component: ManterDocumentoFornecedorComponent;
  let fixture: ComponentFixture<ManterDocumentoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterDocumentoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterDocumentoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
