import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { Arquivo, CategoriaProduto, ContaContabil, Marca, Moeda, PerfilUsuario, SituacaoSolicitacaoProduto, SolicitacaoProduto, SolicitacaoProdutoComentario, TipoProduto, UnidadeMedida, Usuario } from '@shared/models';
import { SolicitadoPor } from '@shared/models/enums/solicitado-por';
import { TipoSlaSolicitacao } from '@shared/models/enums/tipo-sla-solicitacao';
import { SolicitacaoCadastroSlaFiltro } from '@shared/models/fltros/solicitacao-cadastro-sla-filtro';
import { SlaSolicitacao } from '@shared/models/sla-solicitacao/sla-solicitacao';
import { ArquivoService, AutenticacaoService, CategoriaProdutoService, ContaContabilService, MarcaService, SolicitacaoProdutoService, TranslationLibraryService, UnidadeMedidaService } from '@shared/providers';
import { SlaSolicitacaoService } from '@shared/providers/sla-solicitacao.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'app-manter-solicitacao-produto',
  templateUrl: './manter-solicitacao-produto.component.html',
  styleUrls: ['./manter-solicitacao-produto.component.scss'],
})
export class ManterSolicitacaoProdutoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  idSolicitacaoProduto: number;
  solicitacaoProduto: SolicitacaoProduto;
  form: FormGroup;
  marcas: Array<Marca>;
  contasContabeis: Array<ContaContabil>;
  unidadesMedida: Array<UnidadeMedida>;
  categorias: Array<CategoriaProduto>;
  Moeda = Moeda;
  TipoProduto = TipoProduto;
  solicitacaoCadastroSlaFilter: SolicitacaoCadastroSlaFiltro;
  listaDeSlas: Array<SlaSolicitacao>;
  usuarioSolicitante: boolean = true;
  usuarioGestor: boolean;
  usuarioCadastrador: boolean;
  bloquearFormulario: boolean = false;

  // Máscara do valor.
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
    private fb: FormBuilder,
    public solicitacaoProdutoService: SolicitacaoProdutoService,
    private translationLibrary: TranslationLibraryService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private contaContabilService: ContaContabilService,
    private marcaService: MarcaService,
    private unidadeMedidaService: UnidadeMedidaService,
    private categoriaProdutoService: CategoriaProdutoService,
    private arquivoService: ArquivoService,
    private authService: AutenticacaoService,
    private currencyPipe: CurrencyPipe,
    private slaSolicitacaoService: SlaSolicitacaoService,
  ) {
    super();
  }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioGestor = this.authService.perfil() === PerfilUsuario.Gestor;
    this.usuarioCadastrador = this.authService.perfil() === PerfilUsuario.Cadastrador;
    this.contruirFormulario();
    this.buildFilter();
    this.obterParametros();
  }

  obterParametros() {
    if (this.idSolicitacaoProduto) {
      this.obterSolicitacaoProduto();
    } else {
      this.preencherParametros();
      this.blockUI.stop();
    }
  }

  preencherParametros() {
    try {
      this.obterUnidadesMedida().pipe(
        takeUntil(this.unsubscribe))
        .subscribe((unidadesDeMedidas) => this.unidadesMedida = unidadesDeMedidas);

      this.obterCategorias().pipe(
        takeUntil(this.unsubscribe))
        .subscribe((categorias) => this.categorias = categorias);

      this.obterContasContabeis().pipe(
        takeUntil(this.unsubscribe))
        .subscribe((contasContabeis) => this.contasContabeis = contasContabeis);

      if (!this.exibeBtnEnviar()) {
        this.slaSolicitacaoService.get(this.solicitacaoProduto.idSlaSolicitacao).pipe(
          takeUntil(this.unsubscribe),
          map((slaSolicitacao) => new Array<SlaSolicitacao>(slaSolicitacao)))
          .subscribe((listaSlaSolicitacao) => this.listaDeSlas = listaSlaSolicitacao);
      } else {
        this.obterSLAs().pipe(
          takeUntil(this.unsubscribe))
          .subscribe((listaDeSlas) => this.listaDeSlas = listaDeSlas);
      }

      this.obterMarcas().pipe(
        takeUntil(this.unsubscribe))
        .subscribe((marcas) => this.marcas = marcas);
    } catch (e) {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
  }

  formularioValido(): boolean {
    if (this.form.controls.valorReferencia.invalid) {
      if (this.form.controls.valorReferencia.errors.min) {
        this.toastr.warning('O valor de referência não pode ser menor que zero.');
      } else {
        this.toastr.warning('O valor de referência não pode ser maior que R$ 999.999.999.999,99.');
      }
      return false;
    }

    if (this.form.controls.consumoMedio.invalid) {
      if (this.form.controls.consumoMedio.errors.min) {
        this.toastr.warning('O consumo médio não pode ser menor que zero.');
      } else {
        this.toastr.warning('O consumo médio não pode ser maior que R$ 999.999.999.999,99.');
      }
      return false;
    }

    if (!this.form.valid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }

  async salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formularioValido()) {
      this.processeCamposPermitidosParaUsuarioSolicitante(false);

      const formValue = this.removerMascaras(this.form.value);

      this.processeCamposPermitidosParaUsuarioSolicitante(true);

      const solicitacaoProduto = new SolicitacaoProduto();
      solicitacaoProduto.idSolicitacaoProduto = formValue.idSolicitacaoProduto;
      solicitacaoProduto.idTenant = formValue.idTenant;
      solicitacaoProduto.codigo = formValue.codigo;
      solicitacaoProduto.situacao = formValue.situacao;
      solicitacaoProduto.idCategoriaProduto = formValue.idCategoriaProduto;
      solicitacaoProduto.tipoProduto = formValue.tipoProduto;
      solicitacaoProduto.idUnidadeMedida = formValue.idUnidadeMedida;
      solicitacaoProduto.contasContabeis = this.contasContabeis.filter((m) => formValue.contasContabeis.includes(m.idContaContabil));
      solicitacaoProduto.contaSugerida = formValue.contaSugerida;
      solicitacaoProduto.marcas = this.marcas.filter((m) => formValue.marcas.includes(m.idMarca));
      solicitacaoProduto.marcaSugerida = formValue.marcaSugerida;
      solicitacaoProduto.codigoNcm = formValue.codigoNcm;
      solicitacaoProduto.descricao = formValue.descricao;
      solicitacaoProduto.descricaoCompleta = formValue.descricaoCompleta;
      solicitacaoProduto.moeda = formValue.moeda;
      solicitacaoProduto.valorReferencia = formValue.valorReferencia;
      solicitacaoProduto.consumoMedio = formValue.consumoMedio;
      solicitacaoProduto.referenciaExterna = formValue.referenciaExterna;
      solicitacaoProduto.imagens = formValue.imagens;
      solicitacaoProduto.idSlaSolicitacao = formValue.idSlaSolicitacao;
      solicitacaoProduto.comentarios = formValue.comentarios;
      solicitacaoProduto.idEmpresaSolicitante = formValue.idEmpresaSolicitante;

      if (this.isInsert() && formValue.comentario && formValue.comentario.trim() !== '') {
        const comentario = new SolicitacaoProdutoComentario();
        comentario.comentario = formValue.comentario;
        solicitacaoProduto.comentarios.unshift(comentario);
      }

      if (this.idSolicitacaoProduto) {
        this.alterar(solicitacaoProduto);
      } else {
        this.inserir(solicitacaoProduto);
      }
    } else {
      this.blockUI.stop();
    }
  }

  fechar(result: any = null) {
    this.activeModal.close(result);
  }

  obterMarcas(): Observable<Array<Marca>> {
    return this.obterConsiderandoRegras(this.marcaService.listarHolding(), this.marcaService.listar());
  }

  obterContasContabeis(): Observable<Array<ContaContabil>> {
    return this.obterConsiderandoRegras(this.contaContabilService.listarHolding(), this.contaContabilService.listar());
  }

  obterUnidadesMedida(): Observable<Array<UnidadeMedida>> {
    return this.obterConsiderandoRegras(this.unidadeMedidaService.listarDaEmpresaBase(), this.unidadeMedidaService.listar());
  }

  obterSLAs(): Observable<Array<SlaSolicitacao>> {
    return this.slaSolicitacaoService.getPorTipo(TipoSlaSolicitacao['Produto/Serviço']);
  }

  obterCategorias(): Observable<Array<CategoriaProduto>> {
    return this.obterConsiderandoRegras(this.categoriaProdutoService.listarAtivasDaEmpresaBase(), this.categoriaProdutoService.listar());
  }

  naoExistemCategoriasDisponiveis(event) {
    this.toastr.warning(this.translationLibrary.translations.ALERTS.NO_ITEMS_AVAILABLE);
  }

  isInsert(): boolean {
    return !this.idSolicitacaoProduto;
  }

  exibeBtnEnviar(): boolean {
    const ehCadastro: boolean = this.isInsert();
    const ehEdicao: boolean = this.solicitacaoProduto !== undefined;
    const usuario: Usuario = this.authService.usuario();

    const ehEdicaoEhGestorOuCadastradorEhHoldingComSolicitacaoNaoAprovadaNaoCancelada: boolean =
      ehEdicao &&
      usuario.permissaoAtual.pessoaJuridica.holding &&
      (usuario.permissaoAtual.perfil === PerfilUsuario.Gestor || usuario.permissaoAtual.perfil === PerfilUsuario.Cadastrador) &&
      this.solicitacaoProduto.situacao !== SituacaoSolicitacaoProduto.Aprovado &&
      this.solicitacaoProduto.situacao !== SituacaoSolicitacaoProduto.Cancelado;

    const ehEdicaoEhSolicitanteComSolicitacaoNaoAprovada: boolean =
      ehEdicao &&
      this.isUsuarioSolicitante() &&
      this.solicitacaoProduto.situacao !== SituacaoSolicitacaoProduto.Aprovado &&
      this.solicitacaoProduto.situacao !== SituacaoSolicitacaoProduto.Cancelado;

    const habilitaCampos = ehCadastro || ehEdicaoEhGestorOuCadastradorEhHoldingComSolicitacaoNaoAprovadaNaoCancelada || ehEdicaoEhSolicitanteComSolicitacaoNaoAprovada;

    if (habilitaCampos) {
      this.form.enable();
      this.bloquearFormulario = false;

      if (!this.isUsuarioSolicitante()) {
        this.processeCamposPermitidosParaUsuarioSolicitante(true);
      }
    } else {
      this.bloquearFormulario = true;
      this.form.disable();
    }

    return habilitaCampos;
  }

  async removerImagem(index: number) {
    try {
      const imagens = this.form.value.imagens;

      if (this.idSolicitacaoProduto && imagens[index].idArquivo) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        // await this. deletarProdutoArquivo(this.idSolicitacaoProduto, imagens[index].idArquivo);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      }

      imagens.splice(index, 1);
      this.form.patchValue({ imagens: imagens });

    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  async imagensSelecionadas(arquivos: Array<Arquivo>) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.salvarArquivo(arquivos[i]);
        // await this.salvarProdutoArquivo(this.idProduto, arquivos[i].idArquivo);
      }
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();

      let imagens = this.form.value.imagens;
      if (!imagens) {
        imagens = new Array<Arquivo>();
      }
      imagens = imagens.concat(arquivos);
      this.form.patchValue({ imagens: imagens });

    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  async salvarImagens() {
    let formImagens = this.form.value.imagens;
    const imagens = formImagens.filter((i) => !i.idArquivo);
    if (imagens) {
      for (let i = 0; i < imagens.length; i++) {
        imagens[i] = await this.salvarArquivo(imagens[i]);
      }
      formImagens = formImagens.filter((i) => i.idArquivo);
      if (formImagens) {
        this.form.patchValue({ imagens: formImagens.concat(imagens) });
      } else {
        this.form.patchValue({ imagens: imagens });
      }
    }
  }

  async salvarArquivo(arquivo: Arquivo): Promise<Arquivo> {
    return this.arquivoService.inserir(arquivo).toPromise();
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idSolicitacaoProduto: [0],
      idTenant: [0],
      codigo: [''],
      situacao: [SituacaoSolicitacaoProduto.Solicitado],
      idCategoriaProduto: [null, Validators.required],
      tipoProduto: [0, Validators.required],
      idUnidadeMedida: [null, Validators.required],
      contasContabeis: [new Array<any>()],
      contaSugerida: [''],
      marcas: [new Array<any>()],
      marcaSugerida: [''],
      codigoNcm: [''],
      descricao: ['', Validators.required],
      descricaoCompleta: [''],
      moeda: [Moeda.Real, Validators.required],
      valorReferencia: [null, Validators.compose([Validators.min(0), Validators.max(999999999.9999)])],
      consumoMedio: [null, Validators.compose([Validators.min(0), Validators.max(999999999.9999)])],
      referenciaExterna: [''],
      imagens: [new Array<Arquivo>()],
      comentario: [''],
      comentarios: [new Array<SolicitacaoProdutoComentario>()],

      idUsuarioSolicitante: [0],
      nomeUsuarioSolicitante: [''],
      idUsuarioResponsavel: [0],
      nomeUsuarioResponsavel: [''],
      idEmpresaSolicitante: [0],
      // nomeEmpresaSolicitante: [''],
      dataCriacao: [''],
      idSlaSolicitacao: [null, Validators.required],
    });
  }

  private obterSolicitacaoProduto() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.solicitacaoProdutoService.obterPorId(this.idSolicitacaoProduto).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.preencherFormulario(response);

            if (!this.isUsuarioSolicitante()) {
              this.usuarioSolicitante = false;
              this.processeCamposPermitidosParaUsuarioSolicitante(true);
            }
          } else {
            this.toastr.error('Houve uma falha ao carregar solicitação.');
          }
          this.blockUI.stop();
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private processeCamposPermitidosParaUsuarioSolicitante(desabilitar: boolean) {
    if (desabilitar) {
      this.form.controls.tipoProduto.disable();
      this.form.controls.idUnidadeMedida.disable();
      this.form.controls.contasContabeis.disable();
      this.form.controls.marcas.disable();
      this.form.controls.moeda.disable();
      this.form.controls.idSlaSolicitacao.disable();
    } else {
      this.form.controls.tipoProduto.enable();
      this.form.controls.idUnidadeMedida.enable();
      this.form.controls.contasContabeis.enable();
      this.form.controls.marcas.enable();
      this.form.controls.moeda.enable();
      this.form.controls.idSlaSolicitacao.enable();
    }
  }

  private preencherFormulario(solicitacaoProduto: SolicitacaoProduto) {
    this.solicitacaoProduto = solicitacaoProduto;

    this.preencherParametros();

    this.solicitacaoProduto.marcas = this.solicitacaoProduto.marcas.map((m) => m.idMarca);
    this.solicitacaoProduto.contasContabeis = this.solicitacaoProduto.contasContabeis.map((m) => m.idContaContabil);
    this.form.patchValue(this.adicionarMascaras(this.solicitacaoProduto));
    this.form.patchValue({ 'idEmpresaSolicitante': solicitacaoProduto.idEmpresaSolicitante });
  }

  private adicionarMascaras(solicitacaoProduto: any) {
    if (solicitacaoProduto.valorReferencia) {
      solicitacaoProduto.valorReferencia = this.currencyPipe.transform(solicitacaoProduto.valorReferencia, undefined, '', '1.2-4', 'pt-BR').trim();
    } else {
      solicitacaoProduto.valorReferencia = '';
    }

    if (solicitacaoProduto.consumoMedio) {
      solicitacaoProduto.consumoMedio = this.currencyPipe.transform(solicitacaoProduto.consumoMedio, undefined, '', '1.2-4', 'pt-BR').trim();
    } else {
      solicitacaoProduto.consumoMedio = '';
    }

    return solicitacaoProduto;
  }

  private removerMascaras(solicitacaoProduto: any): SolicitacaoProduto {
    // Utiliza expressão regular para remover todos os pontos da string
    if (solicitacaoProduto.valorReferencia) {
      const valor = solicitacaoProduto.valorReferencia + '';
      solicitacaoProduto.valorReferencia = +(valor.replace(/\./g, '').replace(',', '.'));
    }

    if (solicitacaoProduto.consumoMedio) {
      const consumo = solicitacaoProduto.consumoMedio + '';
      solicitacaoProduto.consumoMedio = +(consumo.replace(/\./g, '').replace(',', '.'));
    }
    return solicitacaoProduto;
  }

  private inserir(solicitacaoProduto: SolicitacaoProduto) {
    this.solicitacaoProdutoService.inserir(solicitacaoProduto).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            // this.router.navigate(["/produtos/", response.idProduto]);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.fechar(response);
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private alterar(solicitacaoProduto: SolicitacaoProduto) {
    this.solicitacaoProdutoService.alterar(solicitacaoProduto).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.fechar(response);
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private isUsuarioSolicitante(): boolean {
    return !this.solicitacaoProduto || this.solicitacaoProduto.idUsuarioSolicitante === this.authService.usuario().idUsuario;
  }

  private buildFilter(): void {
    this.solicitacaoCadastroSlaFilter = new SolicitacaoCadastroSlaFiltro();
    this.solicitacaoCadastroSlaFilter.pagina = 1;
    this.solicitacaoCadastroSlaFilter.itensPorPagina = 5;
    this.solicitacaoCadastroSlaFilter.totalPaginas = 0;
    this.solicitacaoCadastroSlaFilter.tipo = 1;
  }

  private obterConsiderandoRegras<T>(obterPorHolding: Observable<Array<T>>, obterPorEmpresaAtual: Observable<Array<T>>): Observable<Array<T>> {
    if (this.idSolicitacaoProduto) {
      if (this.solicitacaoProduto.solicitadoPor === SolicitadoPor.Holding) {
        return obterPorHolding.pipe(map((res) => res));
      }

      const usuario = this.authService.usuario();

      if (this.solicitacaoProduto.solicitadoPor === SolicitadoPor['Franquia/Matriz/Filial']) {
        if (this.solicitacaoProduto.idUsuarioSolicitante === usuario.idUsuario) {
          return obterPorHolding.pipe(map((res) => res));
        }

        return obterPorEmpresaAtual.pipe(map((res) => res));
      }
    } else {
      return obterPorHolding.pipe(map((res) => res));
    }
  }
}
