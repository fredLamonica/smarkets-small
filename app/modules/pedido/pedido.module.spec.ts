import { PedidoModule } from './pedido.module';

describe('PedidoModule', () => {
  let pedidoModule: PedidoModule;

  beforeEach(() => {
    pedidoModule = new PedidoModule();
  });

  it('should create an instance', () => {
    expect(pedidoModule).toBeTruthy();
  });
});
