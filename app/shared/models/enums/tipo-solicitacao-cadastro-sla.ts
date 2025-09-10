export enum TipoSolicatacaoCadastroSla {
    ["produto/servico"] = 1,
    Fornecedor = 2,    
  }  
  export const TipoSolicatacaoCadastroSlaLabel = new Map<number, string>([
    [1, 'Produto / Serviço'],
    [2, 'Fornecedor'],    
  ]);