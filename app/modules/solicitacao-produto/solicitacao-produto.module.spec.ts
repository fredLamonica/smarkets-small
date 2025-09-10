import { SolicitacaoProdutoModule } from './solicitacao-produto.module';

describe('SolicitarcaoProdutoModule', () => {
  let solicitacaoProdutoModule: SolicitacaoProdutoModule;

  beforeEach(() => {
    solicitacaoProdutoModule = new SolicitacaoProdutoModule();
  });

  it('should create an instance', () => {
    expect(solicitacaoProdutoModule).toBeTruthy();
  });
});
