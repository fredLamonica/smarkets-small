import { CatalogoModule } from './catalogo.module';

describe('CatalogoModule', () => {
  let catalogoModule: CatalogoModule;

  beforeEach(() => {
    catalogoModule = new CatalogoModule();
  });

  it('should create an instance', () => {
    expect(catalogoModule).toBeTruthy();
  });
});
