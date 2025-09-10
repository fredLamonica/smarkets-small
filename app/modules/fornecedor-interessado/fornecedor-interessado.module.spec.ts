import { FornecedorInteressadoModule } from './fornecedor-interessado.module';

describe('FornecedorInteressado', () => {
  let fornecedorInteressadoModule: FornecedorInteressadoModule;

  beforeEach(() => {
    fornecedorInteressadoModule = new FornecedorInteressadoModule();
  });

  it('should create an instance', () => {
    expect(fornecedorInteressadoModule).toBeTruthy();
  });
});
