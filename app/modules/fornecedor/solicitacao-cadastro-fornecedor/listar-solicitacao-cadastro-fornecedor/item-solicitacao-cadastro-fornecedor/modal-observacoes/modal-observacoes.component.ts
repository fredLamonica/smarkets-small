import { Component, OnInit } from '@angular/core';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { PessoaFisica, Usuario } from '@shared/models';
import { Comentario } from '@shared/models/interfaces/comentario';
import { ObservacaoSolicitacaoFornecedor } from '@shared/models/observacao-solicitacao-fornecedor';
import { TranslationLibraryService } from '@shared/providers';
import { SolicitacaoCadastroFornecedorService } from '@shared/providers/solicitacao-cadastro-fornecedor.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { takeUntil } from 'rxjs/operators';
import { StatusSolicitacaoFornecedor } from '../../../../../../shared/models/enums/status-solicitacao-fornecedor';

@Component({
  selector: 'modal-observacoes',
  templateUrl: './modal-observacoes.component.html',
  styleUrls: ['./modal-observacoes.component.scss']
})
export class ModalObservacoesComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  statusItem: number;
  idSolicitacaoFornecedor: number;
  observacoesConvertidasEmComentario: Array<Comentario>;
  quantidadeDeCaracteres: number;

  public status = StatusSolicitacaoFornecedor;

  constructor(private solicitacaoCadastroFornecedorService: SolicitacaoCadastroFornecedorService, private translationLibrary: TranslationLibraryService) {
    super();
  }

  ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.solicitacaoCadastroFornecedorService.getObservacoes(this.idSolicitacaoFornecedor).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(listaDeObservacoes => {
        this.convertaParaListaDeComentarios(listaDeObservacoes);
        this.blockUI.stop();
      });
  }

  enviarObservacao(observacao: string): void {
    this.solicitacaoCadastroFornecedorService.postObservacao(this.idSolicitacaoFornecedor, new ObservacaoSolicitacaoFornecedor({
      idSolicitacaoFornecedor: this.idSolicitacaoFornecedor,
      observacao: observacao
    })).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(observacaoCadastrada => this.observacoesConvertidasEmComentario.unshift(this.convertaParaComentario(observacaoCadastrada)));
  }

  private convertaParaListaDeComentarios(observacoes: Array<ObservacaoSolicitacaoFornecedor>): void {
    this.observacoesConvertidasEmComentario = new Array<Comentario>();

    if (observacoes && observacoes.length > 0) {
      for (let i = 0; i < observacoes.length; i++) {
        this.observacoesConvertidasEmComentario.push(this.convertaParaComentario(observacoes[i]));
      }
    }
  }

  private convertaParaComentario(observacao: ObservacaoSolicitacaoFornecedor): Comentario {
    const pessoaFisica: PessoaFisica = new PessoaFisica();
    pessoaFisica.nome = observacao.nomeUsuario;

    const usuario: Usuario = new Usuario();
    usuario.pessoaFisica = pessoaFisica;

    const comentario: Comentario = {
      idUsuarioAutor: observacao.idUsuario,
      usuarioAutor: usuario,
      comentario: observacao.observacao,
      dataCriacao: observacao.data
    };

    return comentario;
  }
}
