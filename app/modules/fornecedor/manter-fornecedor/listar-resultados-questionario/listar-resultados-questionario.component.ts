import { Component, OnInit, Input } from '@angular/core';
import {
  ResultadoQuestionarioFornecedor,
  PerfilUsuario,
  Usuario,
  SituacaoQuestionarioFornecedor,
  RespostaGestaoFornecedor
} from '@shared/models';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import {
  TranslationLibraryService,
  AutenticacaoService,
  ResultadoQuestionarioFornecedorService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'listar-resultados-questionario',
  templateUrl: './listar-resultados-questionario.component.html',
  styleUrls: ['./listar-resultados-questionario.component.scss']
})
export class ListarResultadosQuestionarioComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() idPessoaJuridica: number;

  public perfilUsuario: PerfilUsuario;

  public enumPerfilUsuario = PerfilUsuario;
  public enumSituacaoQuestionario = SituacaoQuestionarioFornecedor;

  public resultados: Array<ResultadoQuestionarioFornecedor>;
  public idElementoQuestionario: string;
  public usuarioLogado: Usuario;
  public comentarios = new Array<string>();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private autenticacaoService: AutenticacaoService,
    private resultadoQuestionarioFornecedorService: ResultadoQuestionarioFornecedorService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.usuarioLogado = this.autenticacaoService.usuario();
    this.perfilUsuario = this.autenticacaoService.perfil();
    this.obterResultadosQuestionarios();
  }

  public mostrarQuestionario(id) {
    if (this.idElementoQuestionario != id) {
      if (this.idElementoQuestionario) {
        document.getElementById(this.idElementoQuestionario).click();
      }
      this.idElementoQuestionario = id;
    } else {
      this.idElementoQuestionario = null;
    }
  }

  public obterResultadosQuestionarios() {
    if (this.idPessoaJuridica) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.resultadoQuestionarioFornecedorService.obter(this.idPessoaJuridica).subscribe(
        response => {
          if (response) {
            this.resultados = response;
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

  public getInitials(nome: any) {
    let initials = nome.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials.toUpperCase();
  }
}
