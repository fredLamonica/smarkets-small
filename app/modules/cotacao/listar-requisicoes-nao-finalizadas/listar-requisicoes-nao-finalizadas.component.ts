import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import {
  CotacaoItem,
  CustomTableColumn,
  CustomTableColumnType,
  CustomTableSettings
} from '@shared/models';
import { CotacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-requisicoes-nao-finalizadas',
  templateUrl: './listar-requisicoes-nao-finalizadas.component.html',
  styleUrls: ['./listar-requisicoes-nao-finalizadas.component.scss']
})
export class ListarRequisicoesNaoFinalizadasComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public requisicoes: Array<CotacaoItem>;

  public settings: CustomTableSettings;
  public selecionadas: Array<CotacaoItem>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private cotacaoService: CotacaoService
  ) {}

  ngOnInit() {
    this.configurarTabela();
  }

  public cancelar() {
    this.activeModal.close();
  }

  public confirmar() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true
    });
    modalRef.componentInstance.confirmacao = `Tem certeza que deseja continuar?`;
    modalRef.result.then(result => {
      if (result) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        let itensFinalizar = this.requisicoes.filter(r => !this.selecionadas.includes(r));
        this.cotacaoService.encerrarRequisicaoItem(this.selecionadas, itensFinalizar).subscribe(
          response => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            this.activeModal.close(true);
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
      }
    });
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Descrição', 'produto.descricao', CustomTableColumnType.text),
        new CustomTableColumn(
          'Quantidade Solicitada',
          'requisicaoItem.quantidade',
          CustomTableColumnType.text
        ),
        new CustomTableColumn(
          'Quantidade Comprada',
          'requisicaoItem.quantidadeComprada',
          CustomTableColumnType.text
        ),
        new CustomTableColumn(
          'Quantidade Restante',
          'requisicaoItem.quantidadeRestante',
          CustomTableColumnType.text
        )
      ],
      'check'
    );
  }

  public selecao(requisicoes: Array<CotacaoItem>) {
    this.selecionadas = requisicoes;
  }
}
