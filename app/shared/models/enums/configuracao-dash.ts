export enum ConfiguracaoDash {
  Padrao = 1,
  Integracao = 2,
  PendenciaFornecedores = 3,
  FastEquote = 4
}

// para usar:
// configuracaoDashLabel = ConfiguracaoDashLabel;
// dashConfiguracaoLabel.get(item).valueOf();

export const ConfiguracaoDashLabel = new Map<number, string>([
  [1, 'Padrão'],
  [2, 'Integração'],
  [3, 'Pendência de Fornecedores'],
  [4, 'Fast & Equote']
]);
