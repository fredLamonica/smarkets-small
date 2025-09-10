import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaProduto, GrupoCompradores, MatrizResponsabilidade, MatrizResponsabilidadeDto, MatrizUsuarioAlcada, PerfilUsuario, SlaItem, TipoRequisicao, UnidadeMedidaTempo, Usuario } from '@shared/models';
import { AutenticacaoService, CategoriaProdutoService, GrupoCompradoresService, MatrizResponsabilidadeService, SlaService, TipoRequisicaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { UsuarioService } from '../../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-modal-matriz-responsabilidade',
  templateUrl: './modal-matriz-responsabilidade.component.html',
  styleUrls: ['./modal-matriz-responsabilidade.component.scss'],
})
export class ModalMatrizResponsabilidadeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  formClassificacao: FormGroup;
  formAlcada: FormGroup;

  usuarios: Array<Usuario>;
  categorias: Array<CategoriaProduto>;
  tiposRequisicao: Array<TipoRequisicao>;
  gruposCompradores: Array<GrupoCompradores>;

  UnidadeMedidaTempo = UnidadeMedidaTempo;
  idMatrizResponsabilidade: number;
  matriz: MatrizResponsabilidade;
  matrizBckp: MatrizResponsabilidade = new MatrizResponsabilidade();
  matrizDto: MatrizResponsabilidadeDto;

  slaItem: SlaItem;
  slas: Array<SlaItem>;
  slasRemovidos = new Array<SlaItem>();
  slasNovos = new Array<SlaItem>();

  alcadasRemovidas = new Array<MatrizUsuarioAlcada>();
  alcadasNovas = new Array<MatrizUsuarioAlcada>();
  tiposRequisicaoRemovidos = new Array<TipoRequisicao>();
  tiposRequisicaoNovos = new Array<TipoRequisicao>();
  categoriasNovas = new Array<CategoriaProduto>();
  categoriasRemovidas = new Array<CategoriaProduto>();
  gruposCompradoresNovos = new Array<GrupoCompradores>();
  gruposCompradoresRemovidos = new Array<GrupoCompradores>();

  usuarioAtual = new Usuario();

  maskValor = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 4,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 12,
  });

  constructor(
    private usuarioService: UsuarioService,
    private categoriaProdutoService: CategoriaProdutoService,
    private matrizService: MatrizResponsabilidadeService,
    private tipoRequisicaoService: TipoRequisicaoService,
    private slaService: SlaService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private grupoCompradoresService: GrupoCompradoresService,
    private authService: AutenticacaoService,
  ) { }

  async ngOnInit() {
    await this.obterListas();
    this.construirFormularios();

    if (this.idMatrizResponsabilidade) {
      this.matriz = await this.matrizService.obterPorId(this.idMatrizResponsabilidade).toPromise();
      Object.assign(this.matrizBckp, this.matriz);
      this.preencherFormulario(this.matriz);
      this.matrizDto = new MatrizResponsabilidadeDto();
    }

    this.usuarioAtual = this.authService.usuario();
  }

  async obterListas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    try {
      this.usuarios = await this.usuarioService.obterPorPerfil(PerfilUsuario.Comprador).toPromise();
      this.categorias = await this.categoriaProdutoService.listar().toPromise();
      this.tiposRequisicao = await this.tipoRequisicaoService.obterTodos().toPromise();
      this.slas = await this.slaService.ObterSlaPorTempoRequisicaoAprovadaPedido().toPromise();
      this.gruposCompradores = await this.grupoCompradoresService.listar().toPromise();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formMatrizValido()) {
      const matriz = this.form.value;
      if (this.matriz) {
        this.alterar(matriz);
      } else {
        this.inserir(matriz);
      }
    } else {
      this.blockUI.stop();
    }
  }

  // #region Alçadas

  inserirAlcada() {
    if (this.formAlcadaValido()) {
      const alcadaAdicionada = this.formAlcada.value;

      const alcadasUsuario = this.form.value.alcadas.filter((alcada) => {
        return alcadaAdicionada.idUsuario == alcada.idUsuario;
      });

      if (alcadasUsuario.length == 0) {
        alcadaAdicionada.alcadaMinima = this.removerMascara(alcadaAdicionada.alcadaMinima);
        alcadaAdicionada.alcadaMaxima = this.removerMascara(alcadaAdicionada.alcadaMaxima);
        alcadaAdicionada.idMatrizResponsabilidade = this.matriz
          ? this.matriz.idMatrizResponsabilidade
          : 0;
        alcadaAdicionada.usuario = this.usuarios.find(
          (usuario) => usuario.idUsuario == alcadaAdicionada.idUsuario,
        );
        this.form.value.alcadas.unshift(alcadaAdicionada);
        this.formAlcada.reset();
      } else {
        this.toastr.warning('O usuário selecionado já está vinculado a uma alçada.');
      }
    }
  }

  removerAlcada(index: number) {
    const alcada = this.form.value.alcadas[index];
    this.form.value.alcadas.splice(index, 1);

    if (this.matriz && alcada.idMatrizUsuarioAlcada && alcada.idMatrizUsuarioAlcada != 0) {
      this.alcadasRemovidas.push(alcada);
    }
  }

  // #endregion

  // #region Tipos de Requisição

  onTipoRequisicaoClear() {
    if (this.matriz) {
      this.tiposRequisicaoNovos = new Array<TipoRequisicao>();
      this.tiposRequisicaoRemovidos = new Array<TipoRequisicao>();
      this.tiposRequisicaoRemovidos = this.tiposRequisicaoRemovidos.concat(
        this.matriz.tiposRequisicao,
      );
    }
  }

  onTipoRequisicaoAdicionado(tipoAdicionado) {
    if (this.matriz) {
      if (!this.contemTipoRequisicao(tipoAdicionado, this.matriz.tiposRequisicao)) {
        this.tiposRequisicaoNovos.push(tipoAdicionado);
      } else if (this.contemTipoRequisicao(tipoAdicionado, this.tiposRequisicaoRemovidos)) {
        this.tiposRequisicaoRemovidos = this.removeTipoRequisicao(
          tipoAdicionado,
          this.tiposRequisicaoRemovidos,
        );
      }
    }
  }

  onTipoRequisicaoRemovido(event) {
    const tipoRequisicao = event.value;

    if (this.matriz && this.contemTipoRequisicao(tipoRequisicao, this.matriz.tiposRequisicao)) {
      this.tiposRequisicaoRemovidos.push(tipoRequisicao);
    } else if (this.contemTipoRequisicao(tipoRequisicao, this.tiposRequisicaoNovos)) {
      this.tiposRequisicaoNovos = this.removeTipoRequisicao(
        tipoRequisicao,
        this.tiposRequisicaoNovos,
      );
    }
  }

  // #endregion

  // #region Categorias

  onCategoriasClear() {
    if (this.matriz) {
      this.categoriasNovas = new Array<CategoriaProduto>();
      this.categoriasRemovidas = new Array<CategoriaProduto>();
      this.categoriasRemovidas = this.categoriasRemovidas.concat(this.matriz.categoriasProduto);
    }
  }

  onCategoriaAdicionada(categoriaAdicionada) {
    if (this.matriz) {
      if (!this.contemCategoriaProduto(categoriaAdicionada, this.matriz.categoriasProduto)) {
        this.categoriasNovas.push(categoriaAdicionada);
      } else if (this.contemCategoriaProduto(categoriaAdicionada, this.categoriasRemovidas)) {
        this.categoriasRemovidas = this.removerItemListaCategorias(
          categoriaAdicionada,
          this.categoriasRemovidas,
        );
      }
    }
  }

  onCategoriaRemovida(event) {
    const categoriaProduto = event.value;

    if (
      this.matriz &&
      this.contemCategoriaProduto(categoriaProduto, this.matriz.categoriasProduto)
    ) {
      this.categoriasRemovidas.push(categoriaProduto);
    } else if (this.contemCategoriaProduto(categoriaProduto, this.categoriasNovas)) {
      this.categoriasNovas = this.removerItemListaCategorias(
        categoriaProduto,
        this.categoriasNovas,
      );
    }
  }

  // #endregion

  //#region SlaItem

  onSlaClear() {
    if (this.matriz) {
      this.slasNovos = new Array<SlaItem>();
      this.slasRemovidos = new Array<SlaItem>();
      this.slasRemovidos = this.slasRemovidos.concat(this.matriz.slaItens);
    }
  }

  onSlaAdicionado(slaAdicionado) {
    if (this.matriz) {
      if (!this.contemSlaItem(slaAdicionado, this.matriz.slaItens)) {
        this.slasNovos.push(slaAdicionado);
      } else if (this.contemSlaItem(slaAdicionado, this.slasRemovidos)) {
        this.slasRemovidos = this.removerItemListaSlaItem(slaAdicionado, this.slasRemovidos);
      }
    }
  }

  onSlaRemovido(event) {
    const slaItem = event.value;

    if (this.matriz && this.contemSlaItem(slaItem, this.matriz.slaItens)) {
      this.slasRemovidos.push(slaItem);
    } else if (this.contemSlaItem(slaItem, this.slasNovos)) {
      this.slasNovos = this.removerItemListaSlaItem(slaItem, this.slasNovos);
    }
  }

  //#endregion

  // #region Grupos Compradores

  onGrupoCompradoresClear() {
    if (this.matriz) {
      this.gruposCompradoresNovos = new Array<GrupoCompradores>();
      this.gruposCompradoresRemovidos = new Array<GrupoCompradores>();
      this.gruposCompradoresRemovidos = this.gruposCompradoresRemovidos.concat(
        this.matriz.gruposCompradores,
      );
    }
  }

  onGrupoCompradoresAdicionado(grupoCompradoresAdicionado) {
    if (this.matriz) {
      if (!this.contemGrupoCompradores(grupoCompradoresAdicionado, this.matriz.gruposCompradores)) {
        this.gruposCompradoresNovos.push(grupoCompradoresAdicionado);
      } else if (
        this.contemGrupoCompradores(grupoCompradoresAdicionado, this.gruposCompradoresRemovidos)
      ) {
        this.gruposCompradoresRemovidos = this.removerItemListaGrupoCompradores(
          grupoCompradoresAdicionado,
          this.gruposCompradoresRemovidos,
        );
      }
    }
  }

  onGrupoCompradoresRemovido(event) {
    const grupoCompradores = event.value;

    if (
      this.matriz &&
      this.contemGrupoCompradores(grupoCompradores, this.matriz.gruposCompradores)
    ) {
      this.gruposCompradoresRemovidos.push(grupoCompradores);
    } else if (this.contemGrupoCompradores(grupoCompradores, this.gruposCompradoresNovos)) {
      this.gruposCompradoresNovos = this.removerItemListaGrupoCompradores(
        grupoCompradores,
        this.gruposCompradoresNovos,
      );
    }
  }

  // #endregion

  cancelar() {
    this.activeModal.close();
  }

  private construirFormularios() {
    this.form = this.fb.group({
      idMatrizResponsabilidade: [0],
      idTenant: [0],
      quantidadeMinimaPropostas: [null, Validators.required],
      tiposRequisicao: [new Array<TipoRequisicao>(), Validators.required],
      categoriasProduto: [new Array<CategoriaProduto>(), Validators.required],
      slaItens: [new Array<SlaItem>(), Validators.required],
      alcadas: [new Array<MatrizUsuarioAlcada>()],
      gruposCompradores: [new Array<GrupoCompradores>()],
    });

    this.formAlcada = this.fb.group({
      idMatrizUsuarioAlcada: [0],
      idUsuario: [null, Validators.required],
      alcadaMinima: [null, Validators.compose([Validators.required, Validators.min(0)])],
      alcadaMaxima: [null, Validators.required],
    });
  }

  private preencherFormulario(matriz: MatrizResponsabilidade) {
    this.form.patchValue(matriz);
  }

  private formMatrizValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    if (!this.form.value.slaItens.length) {
      this.toastr.warning('É necessário adicionar ao menos um SLA');
      return false;
    }

    if (!this.form.value.alcadas.length) {
      this.toastr.warning('É necessário adicionar ao menos um usuário');
      return false;
    }

    return true;
  }

  private formAlcadaValido(): boolean {
    if (this.formAlcada.invalid) {
      if (this.formAlcada.controls.alcadaMinima.errors.min) {
        this.toastr.warning('Valor mínimo permitido no campo Alçada (Min) é 0');
      } else { this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS); }

      return false;
    }

    const alcadaMinima = this.removerMascara(this.formAlcada.value.alcadaMinima);
    const alcadaMaxima = this.removerMascara(this.formAlcada.value.alcadaMaxima);

    if (alcadaMinima >= alcadaMaxima) {
      this.toastr.warning('Valor em Alçada (Max) deve ser maior que o valor em Alçada (Min).');
      return false;
    }

    if (
      this.authService.usuario().permissaoAtual.pessoaJuridica.habilitarRestricaoAlcadasMatrizResp
    ) {
      if (
        this.form.value.alcadas.some(
          (alcada) => alcada.alcadaMinima <= alcadaMaxima && alcada.alcadaMaxima >= alcadaMinima,
        )
      ) {
        this.toastr.warning('Não deve haver intersecção entre os valores de alçadas.');
        return false;
      }
    }

    return true;
  }

  private removerMascara(valor: string): number {
    return valor ? +valor.replace(/\./g, '').replace(',', '.') : 0;
  }

  private inserir(matriz: MatrizResponsabilidade) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.matrizService.inserir(matriz).subscribe(
      (response) => {
        if (response) { this.activeModal.close(response); }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      (responseError) => {
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      },
    );
  }

  private alterar(matriz: MatrizResponsabilidade) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.montarDto(matriz);
    this.matrizService.alterar(this.matrizDto).subscribe(
      (response) => {
        if (response) {
          this.activeModal.close(response);
        }
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      (responseError) => {
        if (responseError.status == 400) {
          this.toastr.error(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }

        this.blockUI.stop();
      },
    );
  }

  private montarDto(matriz: MatrizResponsabilidade) {
    matriz.idMatrizResponsabilidade = this.matriz.idMatrizResponsabilidade;
    matriz.alcadas = this.matrizBckp.alcadas;
    this.matrizDto.matriz = matriz;

    this.matrizDto.tiposRequisicaoNovos = this.tiposRequisicaoNovos;
    this.matrizDto.tiposRequisicaoRemovidos = this.tiposRequisicaoRemovidos;

    this.matrizDto.alcadasNovas = this.form.value.alcadas.filter(
      (a) => !a.idMatrizUsuarioAlcada || a.idMatrizUsuarioAlcada == 0,
    );
    this.matrizDto.alcadasRemovidas = this.alcadasRemovidas;

    this.matrizDto.categoriasNovas = this.categoriasNovas;
    this.matrizDto.categoriasRemovidas = this.categoriasRemovidas;

    this.matrizDto.slasNovos = this.slasNovos;
    this.matrizDto.slasRemovidos = this.slasRemovidos;

    this.matrizDto.gruposCompradoresNovos = this.gruposCompradoresNovos;
    this.matrizDto.gruposCompradoresRemovidos = this.gruposCompradoresRemovidos;
  }

  private contemTipoRequisicao(
    tipoProcurado: TipoRequisicao,
    listaTipos: Array<TipoRequisicao>,
  ): boolean {
    const tiposFiltrados = listaTipos.filter(function (tipoRequisicao) {
      return tipoRequisicao.idTipoRequisicao == tipoProcurado.idTipoRequisicao;
    });

    return tiposFiltrados && tiposFiltrados.length > 0;
  }

  private removeTipoRequisicao(
    tipoRemovido: TipoRequisicao,
    listaTipos: Array<TipoRequisicao>,
  ): Array<TipoRequisicao> {
    return listaTipos.filter(function (tipoRequisicao) {
      return tipoRequisicao.idTipoRequisicao != tipoRemovido.idTipoRequisicao;
    });
  }

  private contemCategoriaProduto(
    categoriaProcurada: CategoriaProduto,
    listaCategorias: Array<CategoriaProduto>,
  ): boolean {
    const categoriasFiltradas = listaCategorias.filter(function (categoriaProduto) {
      return categoriaProduto.idCategoriaProduto == categoriaProcurada.idCategoriaProduto;
    });

    return categoriasFiltradas && categoriasFiltradas.length > 0;
  }

  private removerItemListaCategorias(
    categoriaRemovida: CategoriaProduto,
    listaCategorias: Array<CategoriaProduto>,
  ): Array<CategoriaProduto> {
    return listaCategorias.filter(function (categoriaProduto) {
      return categoriaProduto.idCategoriaProduto != categoriaRemovida.idCategoriaProduto;
    });
  }

  private contemSlaItem(slaItemProcurado: SlaItem, listaSlaItens: Array<SlaItem>): boolean {
    const slaItensFiltrados = listaSlaItens.filter(function (slaItem) {
      return slaItem.idSlaItem == slaItemProcurado.idSlaItem;
    });

    return slaItensFiltrados && slaItensFiltrados.length > 0;
  }

  private removerItemListaSlaItem(
    slaItemRemovido: SlaItem,
    listaSlaItens: Array<SlaItem>,
  ): Array<SlaItem> {
    return listaSlaItens.filter(function (sla) {
      return sla.idSlaItem != slaItemRemovido.idSlaItem;
    });
  }

  private contemGrupoCompradores(
    grupoCompradoresProcurado: GrupoCompradores,
    listaGruposCompradores: Array<GrupoCompradores>,
  ): boolean {
    const gruposCompradoresFiltrados = listaGruposCompradores.filter(function (grupoCompradores) {
      return grupoCompradores.idGrupoCompradores == grupoCompradoresProcurado.idGrupoCompradores;
    });

    return gruposCompradoresFiltrados && gruposCompradoresFiltrados.length > 0;
  }

  private removerItemListaGrupoCompradores(
    grupoCompradoresRemovido: GrupoCompradores,
    listaGruposCompradores: Array<GrupoCompradores>,
  ): Array<GrupoCompradores> {
    return listaGruposCompradores.filter(function (grupoCompradores) {
      return grupoCompradores.idGrupoCompradores != grupoCompradoresRemovido.idGrupoCompradores;
    });
  }
}
