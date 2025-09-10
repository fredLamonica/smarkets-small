import { Arquivo } from '../arquivo';
import { Anexo } from '../interfaces/anexo';

export class RequisicaoAnexo implements Anexo {

  idRequisicaoAnexo: number;
  idRequisicao: number;
  idArquivo: number;
  dataExclusao: string;
  arquivo: Arquivo;
  permiteExcluir: boolean;

  constructor(init?: Partial<RequisicaoAnexo>) {
    Object.assign(this, init);
  }
}
