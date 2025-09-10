import { CentroCusto } from './centro-custo';
import { ConfiguracaoDeModuloIntegracao } from './configuracao-de-modulo-integracao';
import { PerfilUsuario } from './enums/perfil-usuario';
import { PessoaJuridica } from './pessoa-juridica';

export class Permissao {
  idPermissao: number;
  idUsuario: number;
  idTenant: number;
  perfil: PerfilUsuario;
  pessoaJuridica: PessoaJuridica;
  configuracaoDeModuloIntegracao: ConfiguracaoDeModuloIntegracao;
  idCentroCusto: number;
  idDepartamento: number;
  centroCusto: CentroCusto;
  isSmarkets: boolean;

  constructor(idPermissao: number, idUsuario: number, idTenant: number, perfil: PerfilUsuario, idCentroCusto: number, idDepartamento: number) {
    this.idPermissao = idPermissao;
    this.idUsuario = idUsuario;
    this.idTenant = idTenant;
    this.perfil = perfil;
    this.idCentroCusto = idCentroCusto;
    this.idDepartamento = idDepartamento;
  }
}
