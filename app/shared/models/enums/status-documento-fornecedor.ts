export enum StatusDocumentoFornecedor {
  Aprovados = 1,
  Vencidos = 2,
  NaoEnviados = 3,
  Recusados = 4,
  Vencer = 5,
  Novo = 6
}

export const StatusDocumentoFornecedorLabel = new Map<number, string>([
  [StatusDocumentoFornecedor.Aprovados, 'Aprovados'],
  [StatusDocumentoFornecedor.Vencidos, 'Vencidos'],
  [StatusDocumentoFornecedor.NaoEnviados, 'Não enviados'],
  [StatusDocumentoFornecedor.Recusados, 'Recusados'],
  [StatusDocumentoFornecedor.Vencer, 'A vencer em 30 dias'],
  [StatusDocumentoFornecedor.Novo, "Novo"]
]);
