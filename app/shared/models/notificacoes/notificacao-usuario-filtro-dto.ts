import { FiltroBase } from '../fltros/base/filtro-base';

export class NotificacaoUsuarioFiltroDto extends FiltroBase {

  titulo: string;
  mensagem: string;
  dataCriacao: Date;
  constructor(init?: Partial<NotificacaoUsuarioFiltroDto>) {
    super();
    Object.assign(this, init);
  }
}
