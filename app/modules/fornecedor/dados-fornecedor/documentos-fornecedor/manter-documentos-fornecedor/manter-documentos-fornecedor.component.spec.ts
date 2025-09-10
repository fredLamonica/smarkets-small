import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterDocumentosFornecedorComponent } from './manter-documentos-fornecedor.component';

describe('ManterDocumentosFornecedorComponent', () => {
  let component: ManterDocumentosFornecedorComponent;
  let fixture: ComponentFixture<ManterDocumentosFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterDocumentosFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterDocumentosFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
