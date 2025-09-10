import { CnaeModule } from './cnae.module';

describe('CnaeModule', () => {
  let cnaeModule: CnaeModule;

  beforeEach(() => {
    cnaeModule = new CnaeModule();
  });

  it('should create an instance', () => {
    expect(cnaeModule).toBeTruthy();
  });
});
