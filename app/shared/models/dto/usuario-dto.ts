export class UsuarioDto {
  public idUsuario: number;
  public nome: string;
  public email: string;

  constructor(idUsuario: number, nome: string, email: string) {
    this.idUsuario = idUsuario;
    this.nome = nome;
    this.email = email;
  }
}
