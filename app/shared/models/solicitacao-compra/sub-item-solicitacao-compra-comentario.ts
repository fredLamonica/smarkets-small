import { Usuario } from '../usuario';
import { Comentario } from '../interfaces/comentario';

export class SubItemSolicitacaoCompraComentario implements Comentario {
    public idSubItemSolicitacaoCompraComentario: number;
    public idSubItemItemSolicitacaoCompra: number;
    public idUsuarioAutor: number;
    public usuarioAutor: Usuario;
    public comentario: string;
    public dataCriacao: string;
}