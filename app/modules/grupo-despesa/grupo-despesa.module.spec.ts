import { GrupoDespesaModule } from './grupo-despesa.module';

describe('GrupoDespesaModule', () => {
  let grupoDespesaModule: GrupoDespesaModule;

  beforeEach(() => {
    grupoDespesaModule = new GrupoDespesaModule();
  });

  it('should create an instance', () => {
    expect(grupoDespesaModule).toBeTruthy();
  });
});
