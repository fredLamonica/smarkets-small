import { NaturezaJuridicaModule } from './natureza-juridica.module';

describe('NaturezaJuridicaModule', () => {
  let naturezaJuridicaModule: NaturezaJuridicaModule;

  beforeEach(() => {
    naturezaJuridicaModule = new NaturezaJuridicaModule();
  });

  it('should create an instance', () => {
    expect(naturezaJuridicaModule).toBeTruthy();
  });
});
