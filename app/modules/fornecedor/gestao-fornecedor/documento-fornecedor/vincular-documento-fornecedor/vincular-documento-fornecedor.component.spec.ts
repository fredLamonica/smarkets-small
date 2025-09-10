import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularDocumentoFornecedorComponent } from './vincular-documento-fornecedor.component';

describe('VincularDocumentoFornecedorComponent', () => {
  let component: VincularDocumentoFornecedorComponent;
  let fixture: ComponentFixture<VincularDocumentoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularDocumentoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularDocumentoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
