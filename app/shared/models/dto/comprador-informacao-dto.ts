import { SituacaoPessoaJuridica } from '..';

export class CompradorInformacaoDto {
  public cnpj: string;
  public situacao: SituacaoPessoaJuridica;
  public dataCadastro: Date;
  public idPessoaJuridica: number;
  public razaoSocial: string;
  public filial: boolean;
  public holding: boolean;
  public franquia: boolean;
  public marca: string;
  public codigoFranquia: string;
}
