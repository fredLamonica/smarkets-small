import { TiposPendenciaFornecedor } from './enums/tipo-pendencia-fornecedor';
import { StatusPendenciaFornecedor } from './enums/status-pendencia-fornecedor';
import { Arquivo } from './arquivo';
import { Usuario } from './usuario';
import { PendenciasFornecedorComentario } from './pendencia-fornecedor-comentario';
import { FornecedorInteressado } from '.';

export class PendenciasFornecedor {
  public idPendenciaFornecedor: number;
  public idFornecedor: number;
  public idUsuario: number;
  public idTenant: number;
  public idPessoaJuridicaFornecedor: number;
  public usuario: Usuario;
  public descricao: String;
  public tipo: TiposPendenciaFornecedor;
  public status: StatusPendenciaFornecedor;
  public dataCadastro: Date;
  public comentarios: Array<PendenciasFornecedorComentario>;
  public anexos: Array<Arquivo>;
  public fornecedor: FornecedorInteressado;
}
