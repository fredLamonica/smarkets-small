import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { CategoriaProduto, Cotacao, CotacaoParticipante, Situacao } from '@shared/models';
import { CotacaoRodadaService, CotacaoService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { IncluirFornecedorComponent } from '../../manter-cotacao-participantes/incluir-fornecedor/incluir-fornecedor.component';
import { CotacaoRodadaProposta } from './../../../../shared/models/cotacao/cotacao-rodada-proposta';

@Component({
  selector: 'app-manter-fornecedor-rodada',
  templateUrl: './manter-fornecedor-rodada.component.html',
  styleUrls: ['./manter-fornecedor-rodada.component.scss'],
})
export class ManterFornecedorRodadaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  cotacao: Cotacao;

  propostasCotacao: Array<CotacaoRodadaProposta> = new Array<CotacaoRodadaProposta>();

  constructor(
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private cotacaoService: CotacaoService,
    private cotacaoRodadaService: CotacaoRodadaService,
  ) { }

  ngOnInit() {
    this.obterPropostasCotacao();
  }

  cancelar() {
    this.activeModal.close(false);
  }

  incluirFornecedor() {
    const modalRef = this.modalService.open(IncluirFornecedorComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    const categoriasProduto: CategoriaProduto[] = [];

    this.cotacao.itens.forEach((item) => {
      if (!categoriasProduto.some((c) => c.idCategoriaProduto === item.produto.idCategoriaProduto)) {
        categoriasProduto.push(item.produto.categoria);
      }
    });

    modalRef.componentInstance.categoriasProduto = categoriasProduto;

    modalRef.result.then((result) => {
      if (result) {
        const cotacaoParticipante = new CotacaoParticipante(
          0,
          this.cotacao.idCotacao,
          moment().format(),
          result.idPessoaJuridica,
          result,
          Situacao.Ativo,
          false,
          result.categoriasProduto,
        );

        this.adicionaParticipante(cotacaoParticipante);
      }
    });
  }

  onExcluirClick(idPessoaJuridica: number) {
    const fornecedorTemProposta = this.fornecedorTemProposta(idPessoaJuridica);

    if (!fornecedorTemProposta) {
      const modalRef = this.modalService.open(ConfirmacaoComponent, {
        centered: true,
      });

      const participante = this.cotacao.participantes.find(
        (p) => p.idPessoaJuridica === idPessoaJuridica,
      );

      const pessoaJuridica = participante.pessoaJuridica;

      modalRef.componentInstance.html = true;
      modalRef.componentInstance.confirmacao = `
      <p>O fornecedor <b>${pessoaJuridica.razaoSocial}</b> será removido da lista de participante da cotação <b>${this.cotacao.idCotacao}</b>.</p
    `;

      modalRef.componentInstance.confirmarLabel = 'Sim';
      modalRef.result.then((result) => {
        if (result) {
          this.excluirFornecedorParticipante(participante.idCotacaoParticipante);
        }
      });
    } else {
      this.toastr.warning(
        'Fornecedor não pode ser removido desta cotação, pois possui proposta(s) enviada(s)',
      );
    }
  }

  private adicionaParticipante(participante: CotacaoParticipante) {
    let jaExiste = false;
    this.cotacao.participantes.forEach((item) => {
      if (item.idPessoaJuridica === participante.idPessoaJuridica) {
        jaExiste = true;
      }
    });

    if (jaExiste) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.SUPPLIER_ALREADY_PARTICIPATING,
      );
      return;
    }

    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.cotacaoService.insiraParticipante(participante).subscribe(
      (participanteInserido) => {
        this.cotacao.participantes.push(participanteInserido);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private fornecedorTemProposta(idPessoaJuridica: number): boolean {
    const proposta = this.propostasCotacao.filter(
      (p) => p.fornecedor.idPessoaJuridica === idPessoaJuridica,
    );

    if (proposta.length > 0) {
      return true;
    }

    return false;
  }

  private obterPropostasCotacao() {
    this.cotacaoRodadaService.obterPorIdCotacao(this.cotacao.idCotacao).subscribe(
      (response) => {
        if (response) {
          this.propostasCotacao = response;
        }
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private excluirFornecedorParticipante(idCotacaoParticipante: number) {
    this.blockUI.start();

    this.cotacaoService.deleteParticipante(idCotacaoParticipante).subscribe(
      () => {
        this.cotacao.participantes.forEach((item, index) => {
          if (item.idCotacaoParticipante === idCotacaoParticipante) {
            this.cotacao.participantes.splice(index, 1);
          }
        });
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
