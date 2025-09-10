import { TipoPessoa } from '../enums/tipo-pessoa';

export class GrupoClienteDto {
  public idPessoaJuridica: number;
  public razaoSocial: string;
  public nomeFantasia: string;
  public idPessoa: number;
  public tipos: TipoPessoa;
  public total: number;
}
