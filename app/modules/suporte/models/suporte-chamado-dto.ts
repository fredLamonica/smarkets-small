import { Arquivo } from '../../../shared/models/arquivo';

export class SuporteChamadoDto {

  titulo: string;
  descricao: string;
  anexos: Array<Arquivo>;

  constructor(init?: Partial<SuporteChamadoDto>) {
    Object.assign(this, init);
  }

}
