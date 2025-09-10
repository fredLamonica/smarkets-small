import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { PessoaFisica, SolicitacaoProdutoComentario, Usuario } from '@shared/models';
import { Comentario } from '@shared/models/interfaces/comentario';
import { AutenticacaoService, SolicitacaoProdutoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'modal-observacoes',
  templateUrl: './modal-observacoes.component.html',
  styleUrls: ['./modal-observacoes.component.scss']
})
export class ModalObservacoesComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  readOnly : boolean;
  idSolicitacao : number;
  comentarios : Array<Comentario>;  
  constructor(private solicitacaoProdutoService: SolicitacaoProdutoService,
              private translationLibrary: TranslationLibraryService,
              private toastr: ToastrService,
              private auth : AutenticacaoService) { super()}

  ngOnInit() {
  }

  enviarObservacao(comentario) : void{
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoProdutoService.comentar(this.idSolicitacao, comentario).pipe(
      takeUntil(this.unsubscribe)
      )
      .subscribe(observacaoCadastrada => 
        {
          this.comentarios.unshift(this.convertaParaComentario(observacaoCadastrada))
          this.blockUI.stop();
        }
        , error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();}
        );   
  }

  private convertaParaComentario(observacao: SolicitacaoProdutoComentario ): Comentario {
    const pessoaFisica: PessoaFisica = new PessoaFisica();
    pessoaFisica.nome = this.auth.usuario().pessoaFisica.nome;

    const usuario: Usuario = new Usuario();
    usuario.pessoaFisica = pessoaFisica;

    const comentario: Comentario = {
      idUsuarioAutor: observacao.idUsuarioAutor,
      usuarioAutor: usuario,
      comentario: observacao.comentario,
      dataCriacao: observacao.dataCriacao
    };

    return comentario;
  }
}
