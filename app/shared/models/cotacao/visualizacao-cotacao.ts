import { Usuario } from '../usuario';
import { PessoaJuridica } from '../pessoa-juridica';

export class VisualizacaoCotacao
{
  public idVisualizacaoCotacao: number;
  public idCotacao: number;
  public idTenant: number;
  public idUsuario: number;
  public dataVisualizacao: string;
  public usuario: Usuario;
  public pessoaJuridica: PessoaJuridica;
}