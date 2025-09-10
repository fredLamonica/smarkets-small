import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManterAcaoFornecedorComponent } from '../manter-acao-fornecedor/manter-acao-fornecedor.component';
import { TranslationLibraryService, ArquivoService, AutenticacaoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { DatePipe } from '@angular/common';
import {
  FornecedorInteressado,
  PlanoAcaoFornecedor,
  StatusPlanoAcaoFornecedor,
  SituacaoAcaoFornecedor,
  AcaoFornecedor,
  Usuario,
  PessoaFisica,
  NotaAcaoFornecedor
} from '@shared/models';
import { PlanoAcaoFornecedorService } from '@shared/providers/plano-acao-fornecedor.service';
import * as moment from 'moment';

@Component({
  selector: 'app-manter-plano-acao-fornecedor',
  templateUrl: './manter-plano-acao-fornecedor.component.html',
  styleUrls: ['./manter-plano-acao-fornecedor.component.scss']
})
export class ManterPlanoAcaoFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input() fornecedor: FornecedorInteressado;
  @Input() planoAcaoFornecedor: PlanoAcaoFornecedor;

  public form: FormGroup;

  public StatusPlanoAcaoFornecedor = StatusPlanoAcaoFornecedor;
  public SituacaoAcaoFornecedor = SituacaoAcaoFornecedor;
  public NotaAcaoFornecedor = NotaAcaoFornecedor;
  public usuarioLogado: Usuario;

  public mostrarInputNome: boolean = false;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private planoAcaoFornecedorService: PlanoAcaoFornecedorService,
    private datePipe: DatePipe,
    private arquivoService: ArquivoService,
    private authService: AutenticacaoService
  ) {}

  ngOnInit() {
    this.usuarioLogado = this.authService.usuario();
    this.construirFormulario();
    if (this.planoAcaoFornecedor == null) this.planoAcaoFornecedor = new PlanoAcaoFornecedor();
    else this.preencherFormulario();
  }

  public fecharModal() {
    this.activeModal.close(this.planoAcaoFornecedor);
  }

  private preencherFormulario() {
    this.form.patchValue(this.planoAcaoFornecedor);
    this.form.controls.prazo.setValue(
      this.datePipe.transform(this.planoAcaoFornecedor.prazo, 'yyyy-MM-dd')
    );
    this.form.controls.emailDoResponsavel.setValue(
      this.planoAcaoFornecedor.usuarioResponsavel.email
    );

    if (this.planoAcaoFornecedor != null) {
      this.form.controls.nomeDoUsuarioResponsavel.setValue(
        this.planoAcaoFornecedor.usuarioResponsavel.pessoaFisica.nome
      );
      this.mostrarInputNome = true;
    }
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
      prazo: [null, Validators.required],
      status: [null],
      nomeDoUsuarioResponsavel: [null],
      emailDoResponsavel: [null, Validators.compose([Validators.required, Validators.email])]
    });

    this.desabilitarCampos();
  }

  private desabilitarCampos() {
    if (this.planoAcaoFornecedor) {
      this.form.controls.nomeDoUsuarioResponsavel.disable();
      this.form.controls.emailDoResponsavel.disable();
    }

    if (!this.fornecedor) {
      this.form.controls.nome.disable();
      this.form.controls.prazo.disable();
      this.form.controls.status.disable();
    }
  }

  public exigirNomeUsuario() {
    this.mostrarInputNome = true;
    this.form.controls.nomeDoUsuarioResponsavel.setValidators(Validators.required);
  }

  public abrirModalDeIncluirAcao() {
    const modalRef = this.modalService.open(ManterAcaoFornecedorComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.idPlanoAcaoFornecedor = this.planoAcaoFornecedor.idPlanoAcaoFornecedor;
    modalRef.componentInstance.titulo = 'Incluir Ação';

    modalRef.result.then(result => {
      if (result) {
        if (result.idAcaoFornecedor) this.planoAcaoFornecedor.acoes.push(result);
      }
    });
  }

  public abrirModalDeEditarAcao(acao: AcaoFornecedor) {
    const modalRef = this.modalService.open(ManterAcaoFornecedorComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
    modalRef.componentInstance.idPlanoAcaoFornecedor = this.planoAcaoFornecedor.idPlanoAcaoFornecedor;
    modalRef.componentInstance.acao = acao;
    modalRef.componentInstance.titulo = 'Editar Ação';
    modalRef.componentInstance.classFormEmail = 'col-lg-9';
    modalRef.componentInstance.classFormData = 'col-lg-3';

    modalRef.result.then(result => {
      if (result) {
        if (result.idAcaoFornecedor) this.planoAcaoFornecedor.acoes.push(result);
      }
    });
  }
  public incluirObservacoes(acao: AcaoFornecedor) {
    const modalRef = this.modalService.open(ManterAcaoFornecedorComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.acao = acao;
    modalRef.componentInstance.titulo = 'Inserir Observação';
  }

  public salvar() {
    if (this.form.valid) {
      this.blockUI.start();
      this.prencherPlanoAcao();
      if (this.planoAcaoFornecedor.idPlanoAcaoFornecedor == undefined) {
        this.inserir();
      } else {
        this.alterar();
      }
      this.fecharModal();
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserir() {
    this.planoAcaoFornecedorService.inserir(this.planoAcaoFornecedor).subscribe(
      response => {
        if (response) {
          this.planoAcaoFornecedor = response;
          this.form.controls.status.setValue(response.status);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        }
      },
      error => {
        switch (error.error) {
          case 'O prazo não pode ser inferior a data atual.':
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          case 'Usuário com este e-mail não existe. Preencha um nome para criar um usuário novo.':
            this.exigirNomeUsuario();
            this.toastr.warning(error.error);
            this.blockUI.stop();
            break;
          default:
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
            break;
        }
      }
    );
  }

  public alterar() {
    this.planoAcaoFornecedorService.alterar(this.planoAcaoFornecedor).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        if (error.error == 'O prazo não pode ser inferior a data atual.')
          this.toastr.warning(error.error);
        else this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);

        this.blockUI.stop();
      }
    );
  }

  private prencherPlanoAcao() {
    this.planoAcaoFornecedor.idFornecedor = this.fornecedor.idFornecedor;
    this.planoAcaoFornecedor.nome = this.form.controls.nome.value;
    this.planoAcaoFornecedor.prazo = this.form.controls.prazo.value;
    if (this.planoAcaoFornecedor.idPlanoAcaoFornecedor != undefined)
      this.planoAcaoFornecedor.status = this.form.controls.status.value;

    if (this.planoAcaoFornecedor.usuarioResponsavel == null) {
      this.planoAcaoFornecedor.usuarioResponsavel = new Usuario();
      this.planoAcaoFornecedor.usuarioResponsavel.email = this.form.controls.emailDoResponsavel.value;
      this.planoAcaoFornecedor.usuarioResponsavel.pessoaFisica = new PessoaFisica();
    } else {
      this.planoAcaoFornecedor.idUsuarioResponsavel = this.planoAcaoFornecedor.usuarioResponsavel.idUsuario;
      this.planoAcaoFornecedor.usuarioResponsavel.pessoaFisica.nome = this.form.controls.nomeDoUsuarioResponsavel.value;
    }
  }

  public alterarSituacaoAcao(acao: AcaoFornecedor, situacao: SituacaoAcaoFornecedor) {
    acao.situacao = situacao;
    this.planoAcaoFornecedorService.alterarAcao(acao).subscribe(
      response => {
        acao = response;
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }

  public async incluirArquivos(arquivos, index) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.arquivoService.inserir(arquivos[i]).toPromise();
      }
      arquivos.forEach(arquivo => {
        this.planoAcaoFornecedor.acoes[index].anexos.push(arquivo);
      });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  public excluirArquivo(arquivo, index) {
    let anexos = this.planoAcaoFornecedor.acoes[index].anexos;
    anexos.splice(arquivo.index, 1);
  }

  public obterComentarios(index) {
    if (this.planoAcaoFornecedor.acoes[index].comentarios == null) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.planoAcaoFornecedorService
        .obterComentariosPorIdAcaoFornecedor(this.planoAcaoFornecedor.acoes[index].idAcaoFornecedor)
        .subscribe(
          response => {
            if (response) this.planoAcaoFornecedor.acoes[index].comentarios = response;
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
    }
  }

  public avaliarAcao(acaoFornecedor: AcaoFornecedor) {
    this.planoAcaoFornecedorService.avaliarAcao(acaoFornecedor).subscribe(
      response => {},
      error => {}
    );
  }

  public getInitials(nome: any) {
    let initials = nome.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials.toUpperCase();
  }
}
