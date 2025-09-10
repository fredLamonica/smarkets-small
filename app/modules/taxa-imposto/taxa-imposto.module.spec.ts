import { TaxaImpostoModule } from './taxa-imposto.module';

describe('TaxaImpostoModule', () => {
  let taxaImpostoModule: TaxaImpostoModule;

  beforeEach(() => {
    taxaImpostoModule = new TaxaImpostoModule();
  });

  it('should create an instance', () => {
    expect(taxaImpostoModule).toBeTruthy();
  });
});
