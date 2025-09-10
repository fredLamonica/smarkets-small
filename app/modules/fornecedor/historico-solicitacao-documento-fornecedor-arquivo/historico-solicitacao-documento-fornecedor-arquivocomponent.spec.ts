import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoSolicitacaoDocumentoFornecedorArquivoComponent } from './historico-solicitacao-documento-fornecedor-arquivo.component';

describe('HistoricoSolicitacaoDocumentoFornecedorArquivoComponent', () => {
  let component: HistoricoSolicitacaoDocumentoFornecedorArquivoComponent;
  let fixture: ComponentFixture<HistoricoSolicitacaoDocumentoFornecedorArquivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoSolicitacaoDocumentoFornecedorArquivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoSolicitacaoDocumentoFornecedorArquivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
