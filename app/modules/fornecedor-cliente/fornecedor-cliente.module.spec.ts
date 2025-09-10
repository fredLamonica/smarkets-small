import { FornecedorClienteModule } from './fornecedor-cliente.module';

describe('FornecedorClienteModule', () => {
  let fornecedorClienteModule: FornecedorClienteModule;

  beforeEach(() => {
    fornecedorClienteModule = new FornecedorClienteModule();
  });

  it('should create an instance', () => {
    expect(fornecedorClienteModule).toBeTruthy();
  });
});
