import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  TranslationLibraryService,
  ConfiguracaoVisitaTecnicaService,
  VisitaTecnicaService,
  ResultadoVisitaTecnicaService,
  AutenticacaoService,
  ArquivoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  ResultadoVisitaTecnica,
  RespostaVisitaTecnica,
  VisitaTecnica,
  SituacaoVisitaTecnica,
  Arquivo
} from '@shared/models';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-manter-resultado-visita-tecnica',
  templateUrl: './manter-resultado-visita-tecnica.component.html',
  styleUrls: ['./manter-resultado-visita-tecnica.component.scss']
})
export class ManterResultadoVisitaTecnicaComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  public idVisitaTecnica: number;
  private paramsSub: Subscription;
  public forms: Array<FormGroup> = new Array<FormGroup>();
  public respostas: Array<RespostaVisitaTecnica> = new Array<RespostaVisitaTecnica>();
  public visitaTecnica: VisitaTecnica;
  public resultadoVisitaTecnica: ResultadoVisitaTecnica = new ResultadoVisitaTecnica();
  public SituacaoVisitaTecnica = SituacaoVisitaTecnica;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private resultadoVisitaTecnicaService: ResultadoVisitaTecnicaService,
    private visitaTecnicaService: VisitaTecnicaService,
    private configuracaoVisitaTecnicaService: ConfiguracaoVisitaTecnicaService,
    private arquivoService: ArquivoService,
    private authService: AutenticacaoService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.resultadoVisitaTecnica.anexos = new Array<Arquivo>();
    this.obterParametros();
  }

  private contruirFormulario() {
    this.respostas.forEach(resposta => {
      this.forms.push(
        this.fb.group({
          idRespostaVisitaTecnica: [resposta.idRespostaVisitaTecnica],
          idResultadoVisitaTecnica: [resposta.idResultadoVisitaTecnica],
          pergunta: [resposta.pergunta],
          tipo: [resposta.tipo],
          impacto: [resposta.impacto],
          resposta: [resposta.resposta, Validators.required]
        })
      );
    });
    if (this.visitaTecnica.status == SituacaoVisitaTecnica.Finalizado) {
      this.forms.forEach(form => {
        form.controls.resposta.disable();
      });
    }
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.idVisitaTecnica = params['idVisitaTecnica'];
      if (this.idVisitaTecnica) {
        this.obterVisitaTecnica();
        this.obterResultadoVisitaTecnica();
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private obterResultadoVisitaTecnica() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.resultadoVisitaTecnicaService.obter(this.idVisitaTecnica).subscribe(
      response => {
        if (response) {
          this.resultadoVisitaTecnica = response;
          this.respostas = this.resultadoVisitaTecnica.respostas;
          this.contruirFormulario();
        } else {
          var te = formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss', 'pt-BR', '-0600');
          this.resultadoVisitaTecnica.dataInicioVisita = new Date(te);
          this.configuracaoVisitaTecnicaService.obter().subscribe(
            response => {
              response.forEach(pergunta => {
                let resposta = new RespostaVisitaTecnica();
                resposta.pergunta = pergunta.questao;
                resposta.impacto = pergunta.impacto;
                resposta.tipo = pergunta.tipo;
                resposta.resposta = '';
                this.respostas.push(resposta);
              });
              this.contruirFormulario();
              this.blockUI.stop();
            },
            error => {
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              this.blockUI.stop();
            }
          );
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private obterVisitaTecnica() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.visitaTecnicaService.obterPorId(this.idVisitaTecnica).subscribe(
      response => {
        this.visitaTecnica = response;
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public salvar() {
    if (this.resultadoVisitaTecnica.idResultadoVisitaTecnica) {
      this.alterar();
    } else {
      this.adicionar();
    }
  }

  public adicionar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    let respostas1 = new Array<RespostaVisitaTecnica>();
    this.forms.forEach(resposta => {
      respostas1.push(resposta.value);
    });
    this.resultadoVisitaTecnica.respostas = respostas1;
    this.resultadoVisitaTecnica.idVisitaTecnica = this.idVisitaTecnica;
    this.resultadoVisitaTecnicaService.inserir(this.resultadoVisitaTecnica).subscribe(
      response => {
        if (this.resultadoVisitaTecnica.idUsuarioFinalizou) {
          this.forms.forEach(form => {
            form.controls.resposta.disable();
          });
          this.visitaTecnica.status = SituacaoVisitaTecnica.Finalizado;
        }
        this.resultadoVisitaTecnica = response;
        let index = 0;
        this.forms.forEach(form => {
          form.patchValue(response.respostas[index]);
          index++;
        });
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.resultadoVisitaTecnica.idUsuarioFinalizou = null;
        this.resultadoVisitaTecnica.usuarioFinalizou = null;
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public alterar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    let respostas1 = new Array<RespostaVisitaTecnica>();
    this.forms.forEach(resposta => {
      respostas1.push(resposta.value);
    });
    this.resultadoVisitaTecnica.respostas = respostas1;
    this.resultadoVisitaTecnica.idVisitaTecnica = this.idVisitaTecnica;
    this.resultadoVisitaTecnicaService.alterar(this.resultadoVisitaTecnica).subscribe(
      response => {
        if (this.resultadoVisitaTecnica.idUsuarioFinalizou) {
          this.forms.forEach(form => {
            form.controls.resposta.disable();
          });
          this.visitaTecnica.status = SituacaoVisitaTecnica.Finalizado;
        }
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.resultadoVisitaTecnica.idUsuarioFinalizou = null;
        this.resultadoVisitaTecnica.usuarioFinalizou = null;
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public async incluirArquivos(arquivos) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.arquivoService.inserir(arquivos[i]).toPromise();
      }
      arquivos.forEach(arquivo => {
        this.resultadoVisitaTecnica.anexos.push(arquivo);
      });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  public excluirArquivo(arquivo) {
    if (!this.resultadoVisitaTecnica.idResultadoVisitaTecnica) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.arquivoService
        .excluir(this.resultadoVisitaTecnica.anexos[arquivo.index].idArquivo)
        .subscribe(
          response => {
            let anexos = this.resultadoVisitaTecnica.anexos;
            anexos.splice(arquivo.index, 1);
            this.resultadoVisitaTecnica.anexos = anexos;
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
    } else {
      let anexos = this.resultadoVisitaTecnica.anexos;
      anexos.splice(arquivo.index, 1);
      this.resultadoVisitaTecnica.anexos = anexos;
    }
  }

  public finalizar() {
    let formularioValido = true;
    this.forms.forEach(form => {
      if (form.invalid || this.isNullOrWhiteSpace(form.controls.resposta.value)) {
        formularioValido = false;
      }
    });
    if (formularioValido) {
      this.resultadoVisitaTecnica.idUsuarioFinalizou = this.authService.usuario().idUsuario;
      this.resultadoVisitaTecnica.usuarioFinalizou = this.authService.usuario();
      var te = formatDate(Date.now(), 'dd-MM-yyyy hh:mm:ss a', 'pt-BR', '-0600');
      this.resultadoVisitaTecnica.dataFimVisita = new Date(te);
      this.salvar();
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  public isNullOrWhiteSpace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch {}
    return a || b;
  }

  public voltar() {
    this.router.navigate(
      ['../../', this.visitaTecnica.idFornecedorVisitaTecnica, 'visita-tecnica'],
      {
        relativeTo: this.route
      }
    );
  }
}
