import { CentroCustoModule } from './centro-custo.module';

describe('CentroCustoModule', () => {
  let centroCustoModule: CentroCustoModule;

  beforeEach(() => {
    centroCustoModule = new CentroCustoModule();
  });

  it('should create an instance', () => {
    expect(centroCustoModule).toBeTruthy();
  });
});
