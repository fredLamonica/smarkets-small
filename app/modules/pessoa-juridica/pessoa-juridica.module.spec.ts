import { PessoaJuridicaModule } from './pessoa-juridica.module';

describe('PessoaJuridicaModule', () => {
  let pessoaJuridicaModule: PessoaJuridicaModule;

  beforeEach(() => {
    pessoaJuridicaModule = new PessoaJuridicaModule();
  });

  it('should create an instance', () => {
    expect(pessoaJuridicaModule).toBeTruthy();
  });
});
