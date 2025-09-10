import { Usuario } from '../usuario';
import { Comentario } from '../interfaces/comentario';

export class SolicitacaoProdutoComentario implements Comentario {
    public IdSolicitacaoProdutoComentario: number;
    public IdSolicitacaoProduto: number;
    public idUsuarioAutor: number;
    public usuarioAutor: Usuario;
    public comentario: string;
    public dataCriacao: string;
}