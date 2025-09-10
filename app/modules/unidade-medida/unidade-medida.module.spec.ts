import { UnidadeMedidaModule } from './unidade-medida.module';

describe('UnidadeMedidaModule', () => {
  let unidadeMedidaModule: UnidadeMedidaModule;

  beforeEach(() => {
    unidadeMedidaModule = new UnidadeMedidaModule();
  });

  it('should create an instance', () => {
    expect(unidadeMedidaModule).toBeTruthy();
  });
});
