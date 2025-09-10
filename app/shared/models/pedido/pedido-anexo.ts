import { Arquivo } from '..';
import { Anexo } from '../interfaces/anexo';

export class PedidoAnexo implements Anexo {

  idPedidoAnexo: number;
  idPedido: number;
  idArquivo: number;
  dataExclusao: Date;
  arquivo: Arquivo;
  idUsuario: number;
  permiteExcluir: boolean;

  constructor(init?: Partial<PedidoAnexo>) {
    Object.assign(this, init);
  }
}
