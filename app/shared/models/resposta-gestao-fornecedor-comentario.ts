import { Comentario } from './interfaces/comentario';
import { Usuario } from '.';

export class RespostaGestaoFornecedorComentario implements Comentario {
    public idRespostaGestaoFornecedorComentario: number;
    public idRespostaGestaoFornecedor: number;
    public idUsuarioAutor: number;
    public usuarioAutor: Usuario;
    public comentario: string;
    public dataCriacao: string;
}