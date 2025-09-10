import { GrupoCompradores } from '@shared/models';
import { CategoriaProduto } from './../categoria-produto';
import { MatrizClassificacao } from '../matriz/matriz-classificacao';
import { MatrizUsuarioAlcada } from '../matriz/matriz-usuario-alcada';
import { MatrizResponsabilidade } from '../matriz/matriz-responsabilidade';
import { TipoRequisicao } from '../requisicao/tipo-requisicao';
import { SlaItem } from '../sla/sla-item';

export class MatrizResponsabilidadeDto {
  public matriz: MatrizResponsabilidade;
  public classificacoesRemovidas: Array<MatrizClassificacao>;
  public classificacoesNovas: Array<MatrizClassificacao>;
  public alcadasNovas: Array<MatrizUsuarioAlcada>;
  public alcadasRemovidas: Array<MatrizUsuarioAlcada>;
  public tiposRequisicaoRemovidos: Array<TipoRequisicao>;
  public tiposRequisicaoNovos: Array<TipoRequisicao>;
  public categoriasNovas: Array<CategoriaProduto>;
  public categoriasRemovidas: Array<CategoriaProduto>;
  public slasRemovidos = new Array<SlaItem>();
  public slasNovos = new Array<SlaItem>();
  public gruposCompradoresRemovidos: Array<GrupoCompradores>;
  public gruposCompradoresNovos: Array<GrupoCompradores>;

  public MatrizResponsabilidadeDto() {
    this.classificacoesNovas = new Array<MatrizClassificacao>();
    this.classificacoesRemovidas = new Array<MatrizClassificacao>();
    this.alcadasNovas = new Array<MatrizUsuarioAlcada>();
    this.alcadasRemovidas = new Array<MatrizUsuarioAlcada>();
    this.tiposRequisicaoNovos = new Array<TipoRequisicao>();
    this.tiposRequisicaoRemovidos = new Array<TipoRequisicao>();
    this.categoriasNovas = new Array<CategoriaProduto>();
    this.categoriasRemovidas = new Array<CategoriaProduto>();
    this.slasRemovidos = new Array<SlaItem>();
    this.slasNovos = new Array<SlaItem>();
    this.gruposCompradoresRemovidos = new Array<GrupoCompradores>();
    this.gruposCompradoresNovos = new Array<GrupoCompradores>();
  }
}
