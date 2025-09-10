import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDocumentosFornecedorComponent } from './listar-documentos-fornecedor.component';

describe('ListarDocumentosFornecedorComponent', () => {
  let component: ListarDocumentosFornecedorComponent;
  let fixture: ComponentFixture<ListarDocumentosFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarDocumentosFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarDocumentosFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
