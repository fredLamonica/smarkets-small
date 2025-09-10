import { Usuario } from '../usuario';
import { Comentario } from '../interfaces/comentario';

export class RequisicaoItemComentario implements Comentario {
    public idRequisicaoItemComentario: number;
    public idRequisicaoItem: number;
    public idUsuarioAutor: number;
    public usuarioAutor: Usuario;
    public comentario: string;
    public dataCriacao: string;
}