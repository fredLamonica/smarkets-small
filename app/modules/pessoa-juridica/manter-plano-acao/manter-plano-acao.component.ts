import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  AcaoFornecedorComentario,
  PlanoAcaoFornecedor,
  Usuario,
  AcaoFornecedor
} from '@shared/models';
import { Subscription } from 'rxjs';
import {
  TranslationLibraryService,
  PlanoAcaoFornecedorService,
  ArquivoService,
  AutenticacaoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { Comentario } from '@shared/models/interfaces/comentario';

@Component({
  selector: 'app-manter-plano-acao',
  templateUrl: './manter-plano-acao.component.html',
  styleUrls: ['./manter-plano-acao.component.scss']
})
export class ManterPlanoAcaoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public planoAcao: PlanoAcaoFornecedor;
  public idPlanoAcaoFornecedor: number;
  private paramsSub: Subscription;
  public placeholder: string = 'Adicione um novo comentário.';
  public comentarios = new Array<string>();
  public usuarioLogado: Usuario;
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
    private location: Location
  ) {}

  ngOnInit() {
    this.usuarioLogado = this.autenticacaoService.usuario();
    this.obterParametros();
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.idPlanoAcaoFornecedor = +params['idPlanoAcao'];
      if (this.idPlanoAcaoFornecedor) this.obterPlanoAcao();
      else this.blockUI.stop();
    });
  }

  private obterPlanoAcao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.planoAcaoFornecedorService
      .obterPorIdComComentariosAnexos(this.idPlanoAcaoFornecedor)
      .subscribe(
        response => {
          this.planoAcao = response;
          this.planoAcao.acoes.forEach(a => {
            a.idPlanoAcaoFornecedor = this.idPlanoAcaoFornecedor;
            a.comentarios = new Array<AcaoFornecedorComentario>();
            this.obterComentarios(a);
            this.comentarios.push('');
          });
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public voltar() {
    this.location.back();
  }

  //#region Comentarios

  public obterComentarios(acao: AcaoFornecedor) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.planoAcaoFornecedorService
      .obterComentariosPorIdAcaoFornecedor(acao.idAcaoFornecedor)
      .subscribe(
        response => {
          if (response) acao.comentarios = response;
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public getInitials(nome: any) {
    let initials = nome.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials.toUpperCase();
  }

  //#endregion
}
