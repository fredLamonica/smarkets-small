import { TipoImportacao } from './tipo-importacao';

export class TipoOperacaoTrack {
  private constructor(public valor: number) {}

  static fup = new TipoOperacaoTrack(1);
  static paradaManutencao = new TipoOperacaoTrack(2);
  static z1pz = new TipoOperacaoTrack(3);
  static qm = new TipoOperacaoTrack(4);

  valueOf() {
    return this.valor;
  }

  toJSON() {
    return this.valor;
  }

  obtenhaTipoImportacao(this: TipoOperacaoTrack): TipoImportacao {
    switch (this) {
      case TipoOperacaoTrack.fup:
        return TipoImportacao.fup;
      case TipoOperacaoTrack.paradaManutencao:
        return TipoImportacao.paradaManutencao;
      case TipoOperacaoTrack.z1pz:
        return TipoImportacao.z1pz;
      case TipoOperacaoTrack.qm:
        return TipoImportacao.qm;
      default:
        throw new Error('Valor inválido');
    }
  }
}
