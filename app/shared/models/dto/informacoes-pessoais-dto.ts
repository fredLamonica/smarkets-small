export class InformacoesPessoaisDto {

  nome: string;
  email: string;
  telefone: string;
  ramal: string;
  celular: string;
  senha: string;

  constructor(init?: Partial<InformacoesPessoaisDto>) {
    Object.assign(this, init);
  }

}
