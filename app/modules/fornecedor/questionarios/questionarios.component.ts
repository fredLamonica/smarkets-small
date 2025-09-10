import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  PerfilUsuario,
  RespostaGestaoFornecedor,
  RespostaGestaoFornecedorComentario,
  RespostaMultiplaEscolhaFornecedor,
  ResultadoQuestionarioFornecedor,
  SituacaoQuestionarioFornecedor,
  Usuario
} from '@shared/models';
import {
  AutenticacaoService,
  QuestionarioGestaoFornecedorService,
  ResultadoQuestionarioFornecedorService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'questionarios-fornecedor',
  templateUrl: './questionarios.component.html',
  styleUrls: ['./questionarios.component.scss']
})
export class QuestionariosComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public questionarios: Array<ResultadoQuestionarioFornecedor>;

  // Usado para pegar o elemento HTML que corresponde a um questionário.
  public idElementoQuestionario: string;
  public situacaoQuestionario = SituacaoQuestionarioFornecedor;
  public formRespostas = new Array<FormGroup>();
  public comentarios = new Array<string>();
  public usuarioLogado: Usuario;
  public perfilUsuario: PerfilUsuario;
  public idFornecedor: number;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private questionarioGestaoFornecedorService: QuestionarioGestaoFornecedorService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private autenticacaoService: AutenticacaoService,
    private resultadoQuestionarioFornecedorService: ResultadoQuestionarioFornecedorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Captura o Id do fornecedor passado na rota Parent.
    this.idFornecedor = this.route.parent.snapshot.params.id;
    this.usuarioLogado = this.autenticacaoService.usuario();
    this.perfilUsuario = this.autenticacaoService.perfil();
    this.obterQuestionariosERespostas();
  }

  public obterQuestionariosERespostas() {
    if (this.perfilUsuario == 3) {
      this.idElementoQuestionario = null;
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.resultadoQuestionarioFornecedorService.obter(this.idFornecedor).subscribe(
        response => {
          if (response) {
            this.questionarios = response;
            this.blockUI.stop();
          }
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }

  // mostrarQuestionario() pega o elemento HTML do questionário entre os questionários, para expandi-lo.
  public mostrarQuestionario(id, index) {
    if (this.idElementoQuestionario != id) {
      if (this.idElementoQuestionario) {
        document.getElementById(this.idElementoQuestionario).click();
      }
      this.idElementoQuestionario = id;
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      if (this.questionarios[index].idResultadoQuestionarioFornecedor) {
        this.construirFormsRespostas(index);
        this.blockUI.stop();
      } else {
        this.construirFormsRespostasPendentes(index);
      }
    } else {
      this.idElementoQuestionario = null;
      this.formRespostas = new Array<FormGroup>();
      this.comentarios = new Array<string>();
    }
  }

  private construirFormsRespostas(index) {
    this.formRespostas = new Array<FormGroup>();
    this.comentarios = new Array<string>();
    this.questionarios[index].respostas.forEach(r => {
      this.formRespostas.push(
        this.fb.group({
          idRespostaGestaoFornecedor: r.idRespostaGestaoFornecedor,
          idResultadoQuestionarioFornecedor: r.idResultadoQuestionarioFornecedor,
          idQuestaoGestaoFornecedor: r.idQuestaoGestaoFornecedor,
          pergunta: r.pergunta,
          notaExplicativa: r.notaExplicativa,
          tipo: r.tipo,
          resposta: r.resposta,
          valor: r.valor,
          permiteComentario: r.permiteComentario,
          comentario: r.comentario,
          opcoes: new Array<RespostaMultiplaEscolhaFornecedor>(),
          categoriaQuestao: r.categoriaQuestao,
          peso: r.peso
        })
      );
      this.formRespostas[this.formRespostas.length - 1].controls.opcoes.setValue(r.opcoes);
      this.comentarios.push('');
    });
    if (this.questionarios[index].situacao == this.situacaoQuestionario.Respondido) {
      this.formRespostas.forEach(form => {
        form.controls.resposta.disable();
      });
    }
  }

  private construirFormsRespostasPendentes(index) {
    this.questionarioGestaoFornecedorService
      .obterPorId(this.questionarios[index].idQuestionarioGestaoFornecedor)
      .subscribe(
        response => {
          this.formRespostas = new Array<FormGroup>();
          this.comentarios = new Array<string>();
          let questionario = response;
          questionario.questoes.forEach(q => {
            this.comentarios.push('');
            this.formRespostas.push(
              this.fb.group({
                idRespostaGestaoFornecedor: 0,
                idResultadoQuestionarioFornecedor: 0,
                idQuestaoGestaoFornecedor: q.idQuestaoGestaoFornecedor,
                pergunta: q.descricao,
                notaExplicativa: q.notaExplicativa,
                tipo: q.tipo,
                resposta: '',
                valor: null,
                permiteComentario: q.permiteComentario,
                comentario: null,
                opcoes: new Array<RespostaMultiplaEscolhaFornecedor>(),
                categoriaQuestao: q.categoriaQuestao,
                peso: q.peso
              })
            );
            this.formRespostas[this.formRespostas.length - 1].controls.opcoes.setValue(q.respostas);
          });
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public salvarComentario(index) {
    let coment = new RespostaGestaoFornecedorComentario();
    coment.comentario = this.comentarios[index];
    coment.dataCriacao = formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', 'pt-BR', '-0300');
    coment.idUsuarioAutor = this.autenticacaoService.usuario().idUsuario;
    coment.usuarioAutor = this.autenticacaoService.usuario();
    this.formRespostas[index].controls.comentario.setValue(coment);
    this.comentarios[index] = '';
  }

  public atualizarQuestionario(index) {
    this.questionarios[index].situacao = this.situacaoQuestionario['Em Andamento'];
    if (this.questionarios[index].idResultadoQuestionarioFornecedor) {
      this.alterarResultado(index);
    } else {
      this.adicionarResultado(index);
    }
  }

  // alterarResultado() atualiza uma resposta já existente para o questionário.
  public alterarResultado(index) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.copiarRespostas(index);
    this.resultadoQuestionarioFornecedorService.alterar(this.questionarios[index]).subscribe(
      response => {
        this.redefinirFormsRespostas();
        if (this.questionarios[index].situacao == this.situacaoQuestionario.Respondido) {
          this.obterResultadoPorId(
            this.questionarios[index].idResultadoQuestionarioFornecedor,
            index
          );
        }
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.questionarios[index].situacao = this.situacaoQuestionario['Em Andamento'];
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private redefinirFormsRespostas() {
    document.getElementById(this.idElementoQuestionario).click();
    this.idElementoQuestionario = null;
    this.formRespostas = new Array<FormGroup>();
    this.comentarios = new Array<string>();
  }

  private obterResultadoPorId(idResultado: number, index: number) {
    this.resultadoQuestionarioFornecedorService.obterPorId(idResultado).subscribe(
      response => {
        if (response) this.questionarios[index] = response;
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }

  private copiarRespostas(index) {
    this.questionarios[index].respostas = new Array<RespostaGestaoFornecedor>();
    this.formRespostas.forEach(resposta => {
      if (
        resposta.controls.tipo.value == 2 &&
        resposta.controls.resposta.value &&
        resposta.controls.resposta.value != ''
      ) {
        const valorAux = resposta.controls.opcoes.value.find(
          o => o.descricao == resposta.controls.resposta.value
        );
        resposta.controls.valor.setValue(valorAux.valor);
      }
      this.questionarios[index].respostas.push(resposta.value);
    });
  }

  // adicionarResultado() registra uma nova resposta para o questionário.
  public adicionarResultado(index) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.copiarRespostas(index);
    this.resultadoQuestionarioFornecedorService.inserir(this.questionarios[index]).subscribe(
      response => {
        this.validarInclusaoResposta(response, index);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.questionarios[index].situacao = this.situacaoQuestionario.Pendente;
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private validarInclusaoResposta(resultadoIncluido: ResultadoQuestionarioFornecedor, index) {
    if (this.questionarios[index].situacao == this.situacaoQuestionario.Respondido) {
      this.formRespostas.forEach(form => {
        form.controls.resposta.disable();
      });
    }
  }

  public finalizarQuestionario(index) {
    let formValido = true;
    this.formRespostas.forEach(form => {
      if (form.invalid || this.isNullOrWhitespace(form.controls.resposta.value)) {
        formValido = false;
      }
    });
    if (formValido) {
      this.questionarios[index].situacao = this.situacaoQuestionario.Respondido;
      if (this.questionarios[index].idResultadoQuestionarioFornecedor) {
        this.alterarResultado(index);
      } else {
        this.adicionarResultado(index);
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  public isNullOrWhitespace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch {}
    return a || b;
  }
  public getInitials(nome: any) {
    let initials = nome.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials.toUpperCase();
  }
}
