export class AlcadaNivelUsuario {

  idAlcadaNivel: number;
  idUsuario: number;
  ordem: number;
  nome: string;

  constructor(init?: Partial<AlcadaNivelUsuario>) {
    Object.assign(this, init);
  }

}
