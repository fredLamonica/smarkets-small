import { Usuario } from '../usuario';
import { Comentario } from '../interfaces/comentario';

export class ItemSolicitacaoCompraComentario implements Comentario {
    public idItemSolicitacaoCompraComentario: number;
    public idItemSolicitacaoCompra: number;
    public idUsuarioAutor: number;
    public usuarioAutor: Usuario;
    public comentario: string;
    public dataCriacao: string;
}