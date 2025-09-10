import { Arquivo } from './arquivo';
import { Usuario } from './usuario';

export class PendenciasFornecedorComentario {
    public idPendenciaFornecedorComentario: number;
    public idPendenciaFornecedor: number;
    public idUsuario: number;
    public usuario: Usuario;
    public dataCadastro: Date;
    public descricao: String;
    public anexos: Array<Arquivo>;
}