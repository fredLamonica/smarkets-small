export enum StatusSolicitacaoFornecedor {
  Solicitado = 1,
  Aprovado = 2,
  Reprovado = 3,
  Cancelado = 4,
  AguardandoIntegracao = 5,
  EmConfiguracao = 6,
}

export const StatusSolicitacaoFornecedorLabel = new Map<number, string>([
  [1, 'Solicitado'],
  [2, 'Aprovado'],
  [3, 'Reprovado'],
  [4, 'Cancelado'],
  [5, 'Aguardando Integração'],
  [6, 'Em Configuração'],
]);
