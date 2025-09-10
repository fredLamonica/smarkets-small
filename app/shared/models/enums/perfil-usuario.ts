export enum PerfilUsuario {
  Administrador = 1,
  Comprador = 2,
  Fornecedor = 3,
  Requisitante = 4,
  Aprovador = 5,
  Gestor = 6,
  Cadastrador = 7,
  GestorDeFornecedores = 8,
  Recebimento = 9,
  RequisitanteTrack = 10,
  ConsultorTrack = 11
}

export const PerfilUsuarioLabel = new Map<number,string>([
  [1, 'Administrador'],
  [2, 'Comprador'],
  [3, 'Fornecedor'],
  [4, 'Requisitante'],
  [5, 'Aprovador'],
  [6, 'Gestor'],
  [7, 'Cadastrador'],
  [8, 'Gestor de Fornecedores'],
  [9, 'Recebimento'],
  [10, 'Requisitante Track'],
  [11, 'Consultor Track']
]);
