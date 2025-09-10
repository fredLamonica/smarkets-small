export enum SituacaoValidacaoDocumentoFornecedor {
  Pendente = 1,
  Valido = 2,
  Invalido = 3
}

export const SituacaoValidacaoDocumentoFornecedorLabel = new Map<number, string>([
  [1, 'Pendente'],
  [2, 'Válido'],
  [3,'Inválido']
]);
