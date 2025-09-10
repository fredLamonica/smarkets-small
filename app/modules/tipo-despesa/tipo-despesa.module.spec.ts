import { TipoDespesaModule } from './tipo-despesa.module';

describe('TipoDespesaModule', () => {
  let tipoDespesaModule: TipoDespesaModule;

  beforeEach(() => {
    tipoDespesaModule = new TipoDespesaModule();
  });

  it('should create an instance', () => {
    expect(tipoDespesaModule).toBeTruthy();
  });
});
