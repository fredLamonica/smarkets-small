import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ConfirmacaoComponent,
  ModalEditarDataVigenciaComponent,
  ModalTimelineDocumentoComponent
} from '@shared/components';
import {
  FornecedorInteressado,
  PerfilUsuario,
  SituacaoValidacaoDocumentoFornecedor,
  SolicitacaoDocumentoFornecedorArquivo,
  SolicitacaoDocumentoFornecedorValidacao,
  Usuario
} from '@shared/models';
import { SolicitacaoDocumentoFornecedorValidacaoDto } from '@shared/models/dto/solicitacao-documento-fornecedor-validacao-dto';
import {
  ArquivoService,
  AutenticacaoService,
  FornecedorService,
  SolicitacaoDocumentoFornecedorArquivoService,
  TranslationLibraryService
} from '@shared/providers';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ModalMotivoComponent } from '../../../modal-motivo/modal-motivo.component';
import { DatePipe } from '@angular/common';
import { ModalEnviarDocumentoComponent } from '../../../documentos-fornecedor/item-documento/modal-enviar-documento/modal-enviar-documento.component';

@Component({
  selector: 'item-documento-fornecedor-cliente',
  templateUrl: './item-documento-fornecedor-cliente.component.html',
  styleUrls: ['./item-documento-fornecedor-cliente.component.scss']
})
export class ItemDocumentoFornecedorClienteComponent implements OnInit {
  @Output() recarregaDocumentos: EventEmitter<any> = new EventEmitter();
  @Input() documento: SolicitacaoDocumentoFornecedorArquivo;
  private fornecedor: FornecedorInteressado;
  public enumSituacaoValidacao = SituacaoValidacaoDocumentoFornecedor;

  private idTenantFornecedor: number | null;
  private currentUser: Usuario;

  constructor(
    private modalService: NgbModal,
    private solicitacaoDocumentoFornecedorArquivoService: SolicitacaoDocumentoFornecedorArquivoService,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private route: ActivatedRoute,
    private arquivoService: ArquivoService,
    private authService: AutenticacaoService,
    private fornecedorService: FornecedorService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.idTenantFornecedor = parseInt(this.route.snapshot.params.idTenantFornecedor) || null;
    this.currentUser = this.authService.usuario();

    this.getFornecedor();
  }

  public solicitarAlteracaoValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor
  ) {
    if (arquivo.idSolicitacaoDocumentoFornecedorArquivo) {
      if (
        !arquivo.validacaoArquivo ||
        arquivo.validacaoArquivo.situacaoValidacaoArquivo == this.enumSituacaoValidacao.Pendente
      ) {
        if (situacao == SituacaoValidacaoDocumentoFornecedor.Valido) {
          const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
          modalRef.componentInstance.confirmacao =
            'Tem certeza que deseja ' +
            (situacao == this.enumSituacaoValidacao.Valido ? 'validar' : 'invalidar') +
            ' esse documento?';
          modalRef.result.then(
            result => {
              if (result) {
                if (arquivo.validacaoArquivo) this.alterarValidacao(arquivo, situacao);
                else this.inserirValidacao(arquivo, situacao);
              }
            },
            reason => {}
          );
        } else if (situacao == SituacaoValidacaoDocumentoFornecedor.Invalido) {
          this.showModalMotivoRecusa(arquivo, situacao);
        }
      }
    } else this.tratarArquivoNaoEnviado();
  }

  private getFornecedor() {
    this.fornecedorService
      .ObterFornecedorRedeLocalPorIdPessoaJuridica(this.documento.idPessoaJuridicaFornecedor)
      .subscribe(
        response => {
          if (response) {
            this.fornecedor = response;
          }
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      );
  }
  private alterarValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor
  ) {
    let validacao = new SolicitacaoDocumentoFornecedorValidacao(
      arquivo.validacaoArquivo.idSolicitacaoDocumentoFornecedorValidacao,
      arquivo.validacaoArquivo.idSolicitacaoDocumentoFornecedorArquivo,
      situacao,
      arquivo.validacaoArquivo.idTenant
    );
    this.solicitacaoDocumentoFornecedorArquivoService.alterarValidacao(validacao).subscribe(
      response => {
        arquivo.validacaoArquivo.situacaoValidacaoArquivo = situacao;
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }

  private inserirValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor,
    motivoRecusa?: string
  ) {
    let solicitacaoDocumentoFornecedorValidacaoDto =
      this.montarSolicitacaoDocumentoFornecedorValidacao(arquivo, situacao, motivoRecusa);

    this.solicitacaoDocumentoFornecedorArquivoService
      .inserirValidacao(solicitacaoDocumentoFornecedorValidacaoDto)
      .subscribe(
        response => {
          arquivo.validacaoArquivo = response;
          this.documento.validacaoArquivo = response;
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      );
  }

  private montarSolicitacaoDocumentoFornecedorValidacao(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacaoValidacaoArquivo: SituacaoValidacaoDocumentoFornecedor,
    motivoRecusa: string
  ): SolicitacaoDocumentoFornecedorValidacaoDto {
    let validacao = new SolicitacaoDocumentoFornecedorValidacao(
      0,
      arquivo.idSolicitacaoDocumentoFornecedorArquivo,
      situacaoValidacaoArquivo,
      this.authService.usuario().permissaoAtual.idTenant,
      motivoRecusa
    );

    let solicitacaoDocumentoFornecedorValidacaoDto = new SolicitacaoDocumentoFornecedorValidacaoDto(
      validacao
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

  get docAVencer() {
    const hoje = moment(moment().format('L')); // L : 'MM/DD/YYYY'
    const dias = -hoje.diff(this.documento.dataVencimento, 'days');
    return (
      this.documento.arquivo.idArquivo &&
      (this.documento.validacaoArquivo.situacaoValidacaoArquivo !=
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
      (this.documento.validacaoArquivo.situacaoValidacaoArquivo !=
        this.enumSituacaoValidacao.Invalido ||
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == null)
    );
  }

  get labelSituacao() {
    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
      this.docVencido
    ) {
      return 'VENCIDO:';
    }

    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
      this.docAVencer
    ) {
      return 'À VENCER:';
    }

    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2
    ) {
      return 'APROVADO:';
    }

    if (
      this.documento.validacaoArquivo &&
      this.documento.validacaoArquivo.situacaoValidacaoArquivo == 3
    ) {
      return 'RECUSADO:';
    }

    if (this.documento.arquivo && !this.documento.validacaoArquivo) {
      return 'NOVO:';
    }

    return 'NÃO ENVIADO';
  }

  public showModalMotivoRecusa(
    arquivo: SolicitacaoDocumentoFornecedorArquivo,
    situacao: SituacaoValidacaoDocumentoFornecedor
  ) {
    const modalRef = this.modalService.open(ModalMotivoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.nomeDoc = arquivo.documentoFornecedor.descricaoDocumento;

    modalRef.result.then(
      result => {
        if (result) {
          if (arquivo.validacaoArquivo) this.alterarValidacao(arquivo, situacao);
          else this.inserirValidacao(arquivo, situacao, result);
        }
      },
      reason => {}
    );
  }

  public showModalEditarDataDeVigencia(arquivo: SolicitacaoDocumentoFornecedorArquivo) {
    const modalRef = this.modalService.open(ModalEditarDataVigenciaComponent, {
      centered: true,
      backdrop: 'static',
      size: 'md' as 'sm'
    });
    modalRef.componentInstance.documento = arquivo;
  }

  public showModalTimeLineDocumento() {
    const modalRef = this.modalService.open(ModalTimelineDocumentoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.documento = this.documento;
  }

  public alert() {
    this.toastr.warning('O documento não possui histórico.');
  }

  public labelTootipVencido() {
    const data = moment(this.documento.dataVencimento).format('DD/MM/YYYY');
    return `Desde do dia ${data} (${this.dias} dias)`;
  }

  public labelTootipAVencer() {
    const data = moment(this.documento.dataVencimento).format('DD/MM/YYYY');
    return `No dia ${data} (${this.dias} dias)`;
  }

  public labelTootipComVigencia() {
    return this.documento.dataVencimento
      ? `Com vigência até ${moment(this.documento.dataVencimento).format('DD/MM/YYYY')}`
      : 'Sem vigência';
  }

  private getCurrentDate() {
    let date = new Date();
    let currenteDate = this.datePipe.transform(date, 'yyyy-MM-ddThh:mm:ss');
    return currenteDate;
  }

  get validateDocument() {
    let currenteDate = this.getCurrentDate();
    let userProfile = this.authService.usuario().permissaoAtual.perfil;
    return (
      (this.documento.validacaoArquivo &&
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
        this.documento.dataVencimento != null &&
        this.documento.dataVencimento.toString() >= currenteDate) ||
      (this.documento.validacaoArquivo &&
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
        !this.documento.dataVencimento)
    );
  }

  public showModalEnviarDocumento() {
    let currenteDate = this.getCurrentDate();

    if (
      (this.documento.validacaoArquivo &&
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
        this.documento.dataVencimento != null &&
        this.documento.dataVencimento.toString() >= currenteDate) ||
      (this.documento.validacaoArquivo &&
        this.documento.validacaoArquivo.situacaoValidacaoArquivo == 2 &&
        !this.documento.dataVencimento)
    ) {
      this.toastr.warning(
        'Não é possível enviar um novo arquivo para documentos que estejam validados ou vigentes'
      );
    } else {
      const modalRef = this.modalService.open(ModalEnviarDocumentoComponent, {
        centered: true,
        backdrop: 'static',
        size: 'lg'
      });

      modalRef.componentInstance.documento = this.documento;

      modalRef.result.then(result => {
        if (result) {
          this.recarregaDocumentos.emit();
        }
      });
    }
  }

  public canEditDocument() {
    let isSupplierProfile =
      !this.idTenantFornecedor &&
      this.currentUser.permissaoAtual.perfil == PerfilUsuario.Fornecedor;

    let isMineSupplier = this.idTenantFornecedor
      ? this.idTenantFornecedor == this.currentUser.permissaoAtual.idTenant
      : false;

    return isSupplierProfile || isMineSupplier;
  }
}
