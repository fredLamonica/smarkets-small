import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosFornecedorComponent } from './documentos-fornecedor.component';

describe('DocumentosFornecedorComponent', () => {
  let component: DocumentosFornecedorComponent;
  let fixture: ComponentFixture<DocumentosFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentosFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
