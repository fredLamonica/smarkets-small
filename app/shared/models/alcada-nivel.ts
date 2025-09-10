import { AlcadaNivelUsuario } from './alcada-nivel-usuario';

export class AlcadaNivel {

  idAlcadaNivel: number;
  idAlcada: number;
  descricao: string;
  valor: number;
  alcadaNivelUsuarios: Array<AlcadaNivelUsuario>;

  constructor(init?: Partial<AlcadaNivel>) {
    Object.assign(this, init);
  }

}
