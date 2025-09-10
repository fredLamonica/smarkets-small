import { CondicaoPagamentoModule } from './condicao-pagamento.module';

describe('CondicaoPagamentoModule', () => {
  let condicaoPagamentoModule: CondicaoPagamentoModule;

  beforeEach(() => {
    condicaoPagamentoModule = new CondicaoPagamentoModule();
  });

  it('should create an instance', () => {
    expect(condicaoPagamentoModule).toBeTruthy();
  });
});
