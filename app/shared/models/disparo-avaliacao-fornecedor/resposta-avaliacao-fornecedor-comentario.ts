import { Usuario } from '../usuario';

export class RespostaAvaliacaoFornecedorComentario {
  public idRespostaAvaliacaoFornecedorComentario: number;
  public idRespostaAvaliacaoFornecedor: number;
  public idUsuarioAutor: number;
  public usuarioAutor: Usuario;
  public comentario: string;
  public dataCriacao: Date;

  constructor(
    idRespostaAvaliacaoFornecedorComentario?: number,
    idRespostaAvaliacaoFornecedor?: number,
    comentario?: string,
    usuarioAutor?: Usuario,
    idUsuarioAutor?: number,
    dataCriacao?: Date
  ) {
    this.idRespostaAvaliacaoFornecedorComentario = idRespostaAvaliacaoFornecedorComentario;
    this.idRespostaAvaliacaoFornecedor = idRespostaAvaliacaoFornecedor;
    this.comentario = comentario;
    this.usuarioAutor = usuarioAutor;
    this.idUsuarioAutor = idUsuarioAutor;
    this.dataCriacao = dataCriacao;
  }
}
