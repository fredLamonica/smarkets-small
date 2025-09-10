import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent, ModalEditarDataVigenciaComponent } from '@shared/components';
import {
  FornecedorInteressado,
  SituacaoValidacaoDocumentoFornecedor,
  SolicitacaoDocumentoFornecedorArquivo,
  SolicitacaoDocumentoFornecedorValidacao
} from '@shared/models';
import { SolicitacaoDocumentoFornecedorValidacaoDto } from '@shared/models/dto/solicitacao-documento-fornecedor-validacao-dto';
import {
  ArquivoService,
  AutenticacaoService,
  SolicitacaoDocumentoFornecedorArquivoService,
  TranslationLibraryService
} from '@shared/providers';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { ModalMotivoComponent } from '../../modal-motivo/modal-motivo.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'item-documento-modal',
  templateUrl: './item-documento-modal.component.html',
  styleUrls: ['./item-documento-modal.component.scss'],
})
export class ItemDocumentoModalComponent extends Unsubscriber implements OnInit {

  get docAVencer() {
    const hoje = moment(moment().format('L')); // L : 'MM/DD/YYYY'
    const dias = -hoje.diff(this.documento.dataVencimento, 'days');
    return (
      this.documento.arquivo.idArquivo &&
      (this.documento.validacaoArquivo.situacaoValidacaoArquivo !==
        this.enumSituacaoValidacao.Invalido ||
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == null) &&
      dias >= 1 &&
      dias <= 29
    );
  }

  get dias() {
    const hoje = moment();
    const dias = -hoje.diff(this.documento.dataVencimento, 'days') + 1;
    if (dias < 0) {
      return -dias;
    }
    return dias;
  }

  get docVencido() {
    const hoje = moment();
    const dataVencimento = moment(this.documento.dataVencimento);
    return (
      hoje > dataVencimento &&
      (this.documento.validacaoArquivo.situacaoValidacaoArquivo !==
        this.enumSituacaoValidacao.Invalido ||
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == null)
    );
  }

  get labelSituacao() {
    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo === 2 &&
      this.docVencido
    ) {
      return 'VENCIDO:';
    }

    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo === 2 &&
      this.docAVencer
    ) {
      return 'À VENCER:';
    }

    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo === 2
    ) {
      return 'APROVADO:';
    }

    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo === 3
    ) {
      return 'RECUSADO:';
    }

    if (this.documento.arquivo && !this.documento.validacaoArquivo) {
      return 'NOVO:';
    }

    return 'NÃO ENVIADO';
  }
  @Input() documento: SolicitacaoDocumentoFornecedorArquivo;
  @Input() fornecedor: FornecedorInteressado;
  enumSituacaoValidacao = SituacaoValidacaoDocumentoFornecedor;

  constructor(
    private modalService: NgbModal,
    private solicitacaoDocumentoFornecedorArquivoService: SolicitacaoDocumentoFornecedorArquivoService,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private arquivoService: ArquivoService,
    private authService: AutenticacaoService,
  ) {
    super();
  }

  ngOnInit() { }

  solicitarAlteracaoValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor,
  ) {
    if (arquivo.idSolicitacaoDocumentoFornecedorArquivo) {
      if (
        !arquivo.validacaoArquivo ||
        arquivo.validacaoArquivo.situacaoValidacaoArquivo === this.enumSituacaoValidacao.Pendente
      ) {
        if (situacao === SituacaoValidacaoDocumentoFornecedor.Valido) {
          const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
          modalRef.componentInstance.confirmacao =
            'Tem certeza que deseja ' +
            (situacao === this.enumSituacaoValidacao.Valido ? 'validar' : 'invalidar') +
            ' esse documento?';
          modalRef.result.then(
            (result) => {
              if (result) {
                if (arquivo.validacaoArquivo) { this.alterarValidacao(arquivo, situacao); } else { this.inserirValidacao(arquivo, situacao); }
              }
            },
            (reason) => { },
          );
        } else if (situacao === SituacaoValidacaoDocumentoFornecedor.Invalido) {
          this.showModalMotivoRecusa(arquivo, situacao);
        }
      }
    } else { this.tratarArquivoNaoEnviado(); }
  }

  baixarArquivo(solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo) {
    if (solicitacaoDocumentoFornecedorArquivo.arquivo) {
      const nomeDoArquivo =
        solicitacaoDocumentoFornecedorArquivo.solicitacaoDocumentoFornecedor.documentoFornecedor.descricaoDocumento +
        solicitacaoDocumentoFornecedorArquivo.arquivo.extensao;

      this.arquivoService.downloadFile(solicitacaoDocumentoFornecedorArquivo.arquivo.idArquivo, nomeDoArquivo).pipe(takeUntil(this.unsubscribe)).subscribe();
    } else {
      this.tratarArquivoNaoEnviado();
    }
  }

  showModalMotivoRecusa(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor,
  ) {
    const modalRef = this.modalService.open(ModalMotivoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalRef.componentInstance.nomeDoc = arquivo.documentoFornecedor.descricaoDocumento;

    modalRef.result.then(
      (result) => {
        if (result) {
          if (arquivo.validacaoArquivo) { this.alterarValidacao(arquivo, situacao); } else { this.inserirValidacao(arquivo, situacao, result); }
        }
      },
      (reason) => { },
    );
  }

  showModalEditarDataDeVigencia(arquivo: SolicitacaoDocumentoFornecedorArquivo) {
    const modalRef = this.modalService.open(ModalEditarDataVigenciaComponent, {
      centered: true,
      backdrop: 'static',
      size: 'md' as 'sm',
    });
    modalRef.componentInstance.documento = arquivo;
  }

  private alterarValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor,
  ) {
    const validacao = new SolicitacaoDocumentoFornecedorValidacao(
      arquivo.validacaoArquivo.idSolicitacaoDocumentoFornecedorValidacao,
      arquivo.validacaoArquivo.idSolicitacaoDocumentoFornecedorArquivo,
      situacao,
      arquivo.validacaoArquivo.idTenant,
    );
    this.solicitacaoDocumentoFornecedorArquivoService.alterarValidacao(validacao).subscribe(
      (response) => {
        arquivo.validacaoArquivo.situacaoValidacaoArquivo = situacao;
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      },
    );
  }

  private inserirValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor,
    motivoRecusa?: string,
  ) {
    const solicitacaoDocumentoFornecedorValidacaoDto =
      this.montarSolicitacaoDocumentoFornecedorValidacao(arquivo, situacao, motivoRecusa);

    this.solicitacaoDocumentoFornecedorArquivoService
      .inserirValidacao(solicitacaoDocumentoFornecedorValidacaoDto)
      .subscribe(
        (response) => {
          arquivo.validacaoArquivo = response;
          this.documento.validacaoArquivo = response;
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  private montarSolicitacaoDocumentoFornecedorValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacaoValidacaoArquivo: SituacaoValidacaoDocumentoFornecedor,
    motivoRecusa: string,
  ): SolicitacaoDocumentoFornecedorValidacaoDto {
    const validacao = new SolicitacaoDocumentoFornecedorValidacao(
      0,
      arquivo.idSolicitacaoDocumentoFornecedorArquivo,
      situacaoValidacaoArquivo,
      this.authService.usuario().permissaoAtual.idTenant,
      motivoRecusa,
    );

    const solicitacaoDocumentoFornecedorValidacaoDto = new SolicitacaoDocumentoFornecedorValidacaoDto(
      validacao,
    );

    solicitacaoDocumentoFornecedorValidacaoDto.nomeDocumento =
      arquivo.documentoFornecedor.descricaoDocumento;
    solicitacaoDocumentoFornecedorValidacaoDto.razaoSocial = this.fornecedor.razaoSocial;
    solicitacaoDocumentoFornecedorValidacaoDto.idPessoaJuridicaFornecedor =
      this.fornecedor.idPessoaJuridicaFornecedor;
    solicitacaoDocumentoFornecedorValidacaoDto.idFornecedor = this.fornecedor.idFornecedor;

    return solicitacaoDocumentoFornecedorValidacaoDto;
  }

  private tratarArquivoNaoEnviado() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao =
      'Não foi possível realizar esta operação, aguardando envio do arquivo';
    modalRef.componentInstance.confirmarLabel = 'none';
    modalRef.componentInstance.cancelarLabel = 'Fechar';
  }

}
