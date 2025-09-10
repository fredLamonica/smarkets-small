import { ContaContabilModule } from './conta-contabil.module';

describe('ContaContabilModule', () => {
  let contaContabilModule: ContaContabilModule;

  beforeEach(() => {
    contaContabilModule = new ContaContabilModule();
  });

  it('should create an instance', () => {
    expect(contaContabilModule).toBeTruthy();
  });
});
