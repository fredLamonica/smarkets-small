import { SuporteModule } from './suporte.module';

describe('SuporteModule', () => {
  let suporteModule: SuporteModule;

  beforeEach(() => {
    suporteModule = new SuporteModule();
  });

  it('should create an instance', () => {
    expect(suporteModule).toBeTruthy();
  });
});
