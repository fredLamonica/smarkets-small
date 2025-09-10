import { Arquivo } from './arquivo';

export class ComentarioPendenciaFornecedor {
    public idPendenciaFornecedorComentario: number ;
    public idPendeciaFornecedor: number ;
    public idUsuario: number ;
    public dataCadastro: Date;
    public descricao: String;
    public anexos: Array<Arquivo>;
}