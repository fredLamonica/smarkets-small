import { Component, OnInit, Input } from '@angular/core';
import { AcaoFornecedor, Usuario, Arquivo } from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  TranslationLibraryService,
  ArquivoService,
  PlanoAcaoFornecedorService,
  AutenticacaoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { ConfirmacaoComponent } from '../modals/confirmacao/confirmacao.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-listar-comentario-plano-acao',
  templateUrl: './listar-comentario-plano-acao.component.html',
  styleUrls: ['./listar-comentario-plano-acao.component.scss']
})
export class ListarComentarioPlanoAcaoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() acao: AcaoFornecedor;
  @Input() indexAcao: number;
  @Input() usuarioLogado: Usuario;
  @Input() ladoGestor: boolean = false;

  public placeholder: string = 'Adicione um novo comentário.';
  public comentarioForm: FormGroup = this.construirConmentarioForm();
  public indexEdicaoComentario: string = '';
  public comentarioEditado: string = '';

  constructor(
    private translationLibrary: TranslationLibraryService,
    private planoAcaoFornecedorService: PlanoAcaoFornecedorService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private arquivoService: ArquivoService,
    private autenticacaoService: AutenticacaoService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (this.acao.idAcaoFornecedor != undefined) {
      this.obterComentarios();
    }
  }

  private construirConmentarioForm() {
    return (this.comentarioForm = this.fb.group({
      idAcaoFornecedorComentario: [0],
      idAcaoFornecedor: [0],
      idUsuarioAutor: [0],
      comentario: ['', Validators.required],
      dataCriacao: [new Date()],
      anexos: [new Array<Arquivo>()]
    }));
  }

  public getInitials(nome: any) {
    let initials = nome.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials.toUpperCase();
  }

  public voltar() {
    this.router.navigate(['./../../'], { relativeTo: this.route });
  }

  public solicitarFinalizacao() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao =
      'Tem certeza que deseja finalizar essa ação? (Não será possível alterá-la após isso)';

    modalRef.result.then(
      result => {
        if (result) this.finalizar();
      },
      reason => {}
    );
  }

  public finalizar() {
    if (this.acao.comentarios.length > 0) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.acao.dataFinalizacao = new Date(
        formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss', 'pt-BR', '-0600')
      );
      this.planoAcaoFornecedorService.alterarAcao(this.acao).subscribe(
        response => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        error => {
          this.acao.dataFinalizacao = null;
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    } else {
      this.toastr.warning('Por favor insira algum comentário antes de finalizar a ação');
    }
  }

  public salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.planoAcaoFornecedorService.alterarAcao(this.acao).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  //#region coments
  public obterComentarios() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.planoAcaoFornecedorService
      .obterComentariosPorIdAcaoFornecedor(this.acao.idAcaoFornecedor)
      .subscribe(
        response => {
          if (response) this.acao.comentarios = response;
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public enviarComentario() {
    this.comentarioForm.controls.idAcaoFornecedor.patchValue(this.acao.idAcaoFornecedor);
    this.comentarioForm.controls.idUsuarioAutor.patchValue(this.usuarioLogado.idUsuario);

    if (this.comentarioForm.valid) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.planoAcaoFornecedorService
        .comentarAcao(this.acao.idAcaoFornecedor, this.comentarioForm.value)
        .subscribe(
          response => {
            if (response) {
              response.usuarioAutor = this.autenticacaoService.usuario();
              this.acao.comentarios.unshift(response);
              this.construirConmentarioForm();
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            } else {
              this.toastr.error(
                'Falha ao enviar comentário. Por favor, verifique a sua conexão com a internet e tente novamente.'
              );
            }
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
    } else {
      this.toastr.warning('Para adicionar um comentário informe uma mensagem.');
    }
  }

  public editarComentario(indexComent: string, textoComentario: string) {
    if (this.indexEdicaoComentario == '') {
      this.indexEdicaoComentario = indexComent;
      this.comentarioEditado = textoComentario;
    } else {
      this.toastr.warning(
        'Outro comentário já está sendo editado, por favor salve ou cancele as alterações primeiro'
      );
    }
  }

  public cancelarEdicaoComentario() {
    this.indexEdicaoComentario = '';
    this.comentarioEditado = '';
  }

  public salvarEdicaoComentario(idComentario) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.planoAcaoFornecedorService
      .alterarComentario(idComentario, this.comentarioEditado)
      .subscribe(
        response => {
          this.planoAcaoFornecedorService
            .obterComentariosPorIdAcaoFornecedor(this.acao.idAcaoFornecedor)
            .subscribe(
              response => {
                if (response) this.acao.comentarios = response;
                this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                this.blockUI.stop();
              },
              error => {
                this.toastr.error(
                  this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR
                );
                this.blockUI.stop();
              }
            );
          this.indexEdicaoComentario = '';
          this.comentarioEditado = '';
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public solicitarExclusaoComentario(indexComentario) {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true });

    modalRef.result.then(
      result => {
        if (result) this.excluirComentario(indexComentario);
      },
      reason => {}
    );
  }

  private excluirComentario(indexComentario) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.planoAcaoFornecedorService
      .deletarComentario(this.acao.comentarios[indexComentario])
      .subscribe(
        response => {
          this.acao.comentarios.splice(indexComentario, 1);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }
  //#endregion

  //#region arquivos
  public async incluirArquivos(arquivos) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.arquivoService.inserir(arquivos[i]).toPromise();
      }
      this.comentarioForm.patchValue({
        anexos: this.comentarioForm.controls.anexos.value.concat(arquivos)
      });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  public excluirArquivo(arquivo) {
    if (!this.comentarioForm.controls.idAcaoFornecedorComentario.value) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.arquivoService
        .excluir(this.comentarioForm.controls.anexos.value[arquivo.index].idArquivo)
        .subscribe(
          response => {
            let anexoss = this.comentarioForm.controls.anexos.value;
            anexoss.splice(arquivo.index, 1);
            this.comentarioForm.patchValue({
              anexos: anexoss
            });
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
    } else {
      let anexoss = this.comentarioForm.controls.anexos.value;
      anexoss.splice(arquivo.index, 1);
      this.comentarioForm.patchValue({
        anexos: anexoss
      });
    }
  }
  //#endregion
}
