import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CategoriaFornecimento,
  FornecedorInteressado,
  PessoaJuridica,
  ResultadoQuestionarioFornecedor,
  SituacaoQuestionarioFornecedor,
  TipoDocumentoFornecedor,
  Usuario
} from '@shared/models';
import {
  AutenticacaoService,
  FornecedorService,
  ResultadoQuestionarioFornecedorService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'questionarios-admin',
  templateUrl: './questionarios-admin.component.html',
  styleUrls: ['./questionarios-admin.component.scss']
})
export class QuestionariosAdminComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  fornecedor: FornecedorInteressado;
  idPessoaJuridicaFornecedor: number;
  tipoDocumentoSelecionado: TipoDocumentoFornecedor;
  pessoaJuridica: PessoaJuridica;

  enumSituacaoQuestionario = SituacaoQuestionarioFornecedor;

  resultados: Array<ResultadoQuestionarioFornecedor>;
  idElementoQuestionario: string;
  usuarioLogado: Usuario;
  comentarios = new Array<string>();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private authService: AutenticacaoService,
    private resultadoQuestionarioFornecedorService: ResultadoQuestionarioFornecedorService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.usuarioLogado = this.authService.usuario();
    this.idPessoaJuridicaFornecedor = this.route.parent.snapshot.params.id;
    this.obterPessoaJuridicaFornecedor();
  }
  private obterPessoaJuridicaFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .ObterFornecedorRedeLocalPorIdPessoaJuridica(this.idPessoaJuridicaFornecedor)
      .subscribe(
        response => {
          if (response) {
            this.fornecedor = response;
            this.obterResultadosQuestionarios();
            if (this.fornecedor.possuiCategoriaFornecimentoInteresse)
              this.fornecedor.categoriasFornecimento.push(
                Object.assign(
                  {},
                  new CategoriaFornecimento(
                    0,
                    'Outras',
                    'Outras',
                    this.authService.usuario().permissaoAtual.idTenant
                  )
                )
              );
            if (response.cnpj.length > 14)
              this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cnpj;
            else {
              this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cpf;
            }
          }
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
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
    if (this.fornecedor.idPessoaJuridicaFornecedor) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.resultadoQuestionarioFornecedorService
        .obter(this.fornecedor.idPessoaJuridicaFornecedor)
        .subscribe(
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
