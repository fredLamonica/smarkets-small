export enum SituacaoDocumentoFornecedorCor {
  Vencido = 1,
  Recusado = 2,
  Vencer = 3,
  NaoEnviado = 4,
  Novo = 5,
  Aprovado = 6
}

export const SituacaoDocumentoFornecedorCorLabel = new Map<number, string>([
  [SituacaoDocumentoFornecedorCor.Vencido, 'Vencido'],
  [SituacaoDocumentoFornecedorCor.Recusado, 'Recusado'],
  [SituacaoDocumentoFornecedorCor.Vencer, 'A Vencer'],
  [SituacaoDocumentoFornecedorCor.NaoEnviado, 'Não Enviado'],
  [SituacaoDocumentoFornecedorCor.Novo, 'Novo'],
  [SituacaoDocumentoFornecedorCor.Aprovado, 'Aprovado']
]);
