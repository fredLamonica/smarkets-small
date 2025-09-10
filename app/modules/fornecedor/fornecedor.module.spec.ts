import { FornecedorModule } from './fornecedor.module';

describe('FornecedorModule', () => {
  let fornecedorModule: FornecedorModule;

  beforeEach(() => {
    fornecedorModule = new FornecedorModule();
  });

  it('should create an instance', () => {
    expect(fornecedorModule).toBeTruthy();
  });
});
