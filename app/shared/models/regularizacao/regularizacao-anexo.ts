import { Arquivo } from '../arquivo';
import { Anexo } from '../interfaces/anexo';

export class RegularizacaoAnexo implements Anexo {

  idRegularizacaoAnexo: number;
  idRegularizacao: number;
  idArquivo: number;
  dataExclusao: string;
  arquivo: Arquivo;
  permiteExcluir: boolean;

  constructor(init?: Partial<RegularizacaoAnexo>) {
    Object.assign(this, init);
  }

}
