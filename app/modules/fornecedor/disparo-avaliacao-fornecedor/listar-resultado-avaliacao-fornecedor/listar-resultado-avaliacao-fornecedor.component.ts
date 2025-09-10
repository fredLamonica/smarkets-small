import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { Ordenacao, PerfilUsuario, RespostaAvaliacaoFornecedor, RespostaAvaliacaoFornecedorComentario, ResultadoAvaliacaoFornecedor, SituacaoResultadoAvaliacaoFornecedor, TipoQuestao, Usuario } from '@shared/models';
import { AutenticacaoService, AvaliacaoFornecedorService, ResultadoAvaliacaoFornecedorService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-listar-resultado-avaliacao-fornecedor',
  templateUrl: './listar-resultado-avaliacao-fornecedor.component.html',
  styleUrls: ['./listar-resultado-avaliacao-fornecedor.component.scss'],
})
export class ListarResultadoAvaliacaoFornecedorComponent implements OnInit {
  get _idAvaliacaoFornecedor(): number {
    return this.idAvaliacaoFornecedor;
  }
  @BlockUI() blockUI: NgBlockUI;

  termo = '';
  pagina: number = 1;
  totalPaginas: number = 0;
  registrosPorPagina: number = 16;
  ordenarPor: string = 'idResultadoAvaliacaoFornecedor';
  ordenacao: Ordenacao = Ordenacao.ASC;

  resultadosAvaliacaoFornecedor: Array<ResultadoAvaliacaoFornecedor> = new Array<ResultadoAvaliacaoFornecedor>();
  idElementoAvaliacao: string;
  usuarioLogado: Usuario;
  SituacaoResposta = SituacaoResultadoAvaliacaoFornecedor;
  comentarios = new Array<string>();
  indexEdicaoComentario = '';
  comentarioEditado = '';

  private idAvaliacaoFornecedor: number;

  constructor(
    private autenticacaoService: AutenticacaoService,
    private translationLibrary: TranslationLibraryService,
    private avaliacaoFornecedorService: AvaliacaoFornecedorService,
    private resultadoAvaliacaoService: ResultadoAvaliacaoFornecedorService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.usuarioLogado = this.autenticacaoService.usuario();
    this.obterParametros();
  }

  mostrarAvaliacao(id, index) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.idElementoAvaliacao != id) {
      if (this.idElementoAvaliacao) {
        document.getElementById(this.idElementoAvaliacao).click();
      }
      if (
        this.resultadosAvaliacaoFornecedor[index].respostas &&
        !(this.resultadosAvaliacaoFornecedor[index].respostas.length > 0)
      ) {
        this.resultadoAvaliacaoService
          .obterRespostasResultadoAvaliacao(
            this.resultadosAvaliacaoFornecedor[index].idResultadoAvaliacaoFornecedor,
          )
          .subscribe(
            (resultado) => {
              this.resultadosAvaliacaoFornecedor[index].respostas = resultado;
            },
            (error) => {
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            },
          );
      }
      this.idElementoAvaliacao = id;
    } else { this.idElementoAvaliacao = null; }
    this.blockUI.stop();
  }

  getInitials(nome: any) {
    let initials = nome.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials.toUpperCase();
  }

  salvar(index) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.preencherCampoValor(this.resultadosAvaliacaoFornecedor[index].respostas);
    this.resultadoAvaliacaoService
      .salvarResultadoAvaliacaoFornecedor(this.resultadosAvaliacaoFornecedor[index])
      .subscribe(
        (resultado) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.resultadosAvaliacaoFornecedor[index].situacao =
            SituacaoResultadoAvaliacaoFornecedor['Em Andamento'];
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
    this.blockUI.stop();
  }

  finalizar(index) {
    if (this.validarRespostas(this.resultadosAvaliacaoFornecedor[index].respostas)) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.preencherCampoValor(this.resultadosAvaliacaoFornecedor[index].respostas);
      this.resultadoAvaliacaoService
        .finalizarResultadoAvaliacaoFornecedor(this.resultadosAvaliacaoFornecedor[index])
        .subscribe(
          (resultado) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.resultadosAvaliacaoFornecedor[index].situacao =
              SituacaoResultadoAvaliacaoFornecedor.Respondida;
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          },
        );
      this.blockUI.stop();
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  buscar(termo) {
    this.termo = termo;
    this.resetPaginacao();
    if (
      this.idAvaliacaoFornecedor &&
      [PerfilUsuario.GestorDeFornecedores, PerfilUsuario.Administrador].includes(
        this.usuarioLogado.permissaoAtual.perfil,
      )
    ) {
      this.filtrarResultadosPorIdAvaliacaoFornecedor();
    } else {
      this.filtrarResultadosPorUsuario();
    }
  }

  resetPaginacao() {
    this.resultadosAvaliacaoFornecedor = new Array<ResultadoAvaliacaoFornecedor>();
    this.pagina = 1;
  }

  onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      if (
        this.idAvaliacaoFornecedor &&
        [PerfilUsuario.GestorDeFornecedores, PerfilUsuario.Administrador].includes(
          this.usuarioLogado.permissaoAtual.perfil,
        )
      ) {
        this.filtrarResultadosPorIdAvaliacaoFornecedor();
      } else {
        this.filtrarResultadosPorUsuario();
      }
    }
  }

  //#region Comentarios

  enviarComentario(indexResultado, indexResposta) {
    if (!this.isNullOrWhitespace(this.comentarios[indexResposta])) {
      const comentario = new RespostaAvaliacaoFornecedorComentario(
        0,
        this.resultadosAvaliacaoFornecedor[indexResultado].respostas[
          indexResposta
        ].idRespostaAvaliacaoFornecedor,
        this.comentarios[indexResposta],
        this.autenticacaoService.usuario(),
      );
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.resultadoAvaliacaoService.inserirComentario(comentario).subscribe(
        (response) => {
          this.resultadosAvaliacaoFornecedor[indexResultado].respostas[
            indexResposta
          ].comentario = response;
          this.comentarios[indexResposta] = '';
          this.resultadosAvaliacaoFornecedor[indexResultado].situacao =
            SituacaoResultadoAvaliacaoFornecedor['Em Andamento'];
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.toastr.warning('Não é possível enviar um comentário vazio');
    }
  }

  salvarEdicaoComentario(idComentario, index, index2) {
    if (!this.isNullOrWhitespace(this.comentarioEditado)) {
      const comentario = new RespostaAvaliacaoFornecedorComentario(
        idComentario,
        this.resultadosAvaliacaoFornecedor[index].respostas[index2].idRespostaAvaliacaoFornecedor,
        this.comentarioEditado,
        this.autenticacaoService.usuario(),
      );
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.resultadoAvaliacaoService.alterarComentario(comentario).subscribe(
        (response) => {
          this.resultadosAvaliacaoFornecedor[index].respostas[index2].comentario = response;
          this.indexEdicaoComentario = '';
          this.comentarioEditado = '';
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.toastr.warning('Não é possível enviar um comentário vazio');
    }
  }

  editarComentario(indexComent: string, textoComentario: string) {
    if (this.indexEdicaoComentario == '') {
      this.indexEdicaoComentario = indexComent;
      this.comentarioEditado = textoComentario;
    } else {
      this.toastr.warning(
        'Outro comentário já está sendo editado, por favor salve ou cancele as alterações primeiro',
      );
    }
  }

  cancelarEdicaoComentario() {
    this.indexEdicaoComentario = '';
    this.comentarioEditado = '';
  }

  solicitarExclusaoComentario(index1, index2) {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true });
    modalRef.result.then(
      (result) => {
        if (result) { this.excluirComentario(index1, index2); }
      },
      (reason) => { },
    );
  }

  private obterParametros() {
    this.route.params.subscribe((params) => {
      this.idAvaliacaoFornecedor = +params['idAvaliacaoFornecedor'];
    });

    if (
      this.idAvaliacaoFornecedor &&
      [PerfilUsuario.GestorDeFornecedores, PerfilUsuario.Administrador].includes(
        this.usuarioLogado.permissaoAtual.perfil,
      )
    ) {
      this.filtrarResultadosPorIdAvaliacaoFornecedor();
    } else { this.filtrarResultadosPorUsuario(); }
  }

  private filtrarResultadosPorUsuario() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.resultadoAvaliacaoService
      .filtrarResultadosPorUsuario(
        this.registrosPorPagina,
        this.pagina,
        this.ordenarPor,
        this.ordenacao,
        this.termo,
      )
      .subscribe(
        (resultado) => {
          if (resultado) {
            this.resultadosAvaliacaoFornecedor = this.resultadosAvaliacaoFornecedor.concat(
              resultado.itens,
            );
            this.totalPaginas = resultado.numeroPaginas;
          } else {
            this.resultadosAvaliacaoFornecedor = new Array<ResultadoAvaliacaoFornecedor>();
            this.totalPaginas = 1;
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
    this.blockUI.stop();
  }

  private filtrarResultadosPorIdAvaliacaoFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.resultadoAvaliacaoService
      .filtrarResultadosPorAvaliacao(
        this.registrosPorPagina,
        this.pagina,
        this.ordenarPor,
        this.ordenacao,
        this.termo,
        this.idAvaliacaoFornecedor,
      )
      .subscribe(
        (resultado) => {
          if (resultado) {
            this.resultadosAvaliacaoFornecedor = this.resultadosAvaliacaoFornecedor.concat(
              resultado.itens,
            );
            this.totalPaginas = resultado.numeroPaginas;
          } else {
            this.resultadosAvaliacaoFornecedor = new Array<ResultadoAvaliacaoFornecedor>();
            this.totalPaginas = 1;
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
    this.blockUI.stop();
  }

  private preencherCampoValor(respostas: Array<RespostaAvaliacaoFornecedor>) {
    respostas.forEach((resposta) => {
      if (resposta.tipo == TipoQuestao['Multipla Escolha']) {
        if (!this.isNullOrWhitespace(resposta.resposta)) {
          resposta.valor = resposta.opcoes.find(
            (opcao) => opcao.descricao == resposta.resposta,
          ).valor;
        } else {
          resposta.valor = null;
        }
      }
    });
  }

  private validarRespostas(respostas: Array<RespostaAvaliacaoFornecedor>): boolean {
    return !respostas.some((resposta) => this.isNullOrWhitespace(resposta.resposta));
  }

  private isNullOrWhitespace(input) {
    return !input || !(input.trim());
  }

  private excluirComentario(index1, index2) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.resultadoAvaliacaoService
      .deletarComentario(
        this.resultadosAvaliacaoFornecedor[index1].respostas[index2].comentario
          .idRespostaAvaliacaoFornecedorComentario,
      )
      .subscribe(
        (response) => {
          this.resultadosAvaliacaoFornecedor[index1].respostas[index2].comentario = null;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  //#endregion
}
