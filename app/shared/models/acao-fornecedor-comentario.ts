import { Usuario } from '.';
import { Comentario } from './interfaces/comentario';
import { Arquivo } from './arquivo';

export class AcaoFornecedorComentario implements Comentario {
  public idAcaoFornecedorComentario: number;
  public AcaoFornecedor: number;
  public idUsuarioAutor: number;
  public usuarioAutor: Usuario;
  public comentario: string;
  public dataCriacao: string;
  public anexos: Array<Arquivo>;
}
