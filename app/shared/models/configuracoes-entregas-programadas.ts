import { ModoModal } from './enums/modo-modal.enum';
import { OrigemProgramacaoDeEntrega } from './enums/origem-programacao-de-entrega.enum';

export class ConfiguracoesEntregasProgramadas {
  origem: OrigemProgramacaoDeEntrega;
  idItem: number;
  dataEntregaMinima: string;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  quantidadeMinimaDoLote: number = 0;
  valorFixo: number;
  valorMascara: any;
  empresaComIntegracaoErp: boolean;
  permiteQuantidadeFracionada: boolean;
  modoModal: ModoModal;
  tituloModal: string;
  index: number;
  valorPropostaFornecedor: number;

  constructor(init?) {
    Object.assign(this, init);
  }
}
