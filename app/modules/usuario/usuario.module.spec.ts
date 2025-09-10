import { UsuarioModule } from './usuario.module';

describe('UsuariosModule', () => {
  let usuarioModule: UsuarioModule;

  beforeEach(() => {
    usuarioModule = new UsuarioModule();
  });

  it('should create an instance', () => {
    expect(usuarioModule).toBeTruthy();
  });
});
