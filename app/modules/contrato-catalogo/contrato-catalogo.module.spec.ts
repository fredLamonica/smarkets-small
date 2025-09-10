import { ContratoCatalogoModule } from './contrato-catalogo.module';

describe('ContratoCatalogoModule', () => {
  let contratoCatalogoModule: ContratoCatalogoModule;

  beforeEach(() => {
    contratoCatalogoModule = new ContratoCatalogoModule();
  });

  it('should create an instance', () => {
    expect(contratoCatalogoModule).toBeTruthy();
  });
});
