import { Usuario } from '../usuario';

export interface Comentario {
  idUsuarioAutor: number;
  usuarioAutor: Usuario;
  comentario: string;
  dataCriacao: string;
}