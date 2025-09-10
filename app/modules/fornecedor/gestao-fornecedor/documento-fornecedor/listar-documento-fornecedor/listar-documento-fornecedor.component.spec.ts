import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDocumentoFornecedorComponent } from './listar-documento-fornecedor.component';

describe('ListarDocumentoFornecedorComponent', () => {
  let component: ListarDocumentoFornecedorComponent;
  let fixture: ComponentFixture<ListarDocumentoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarDocumentoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarDocumentoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
