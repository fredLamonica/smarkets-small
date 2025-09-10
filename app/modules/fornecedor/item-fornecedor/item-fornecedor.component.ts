import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FornecedorInteressado, StatusFornecedorLabel } from '@shared/models';
import { SituacaoDocumentoFornecedorCor } from '@shared/models/enums/situacao-documento-fornecedor-cor';
import { SituacaoPendenciaFornecedorCor } from '@shared/models/enums/situacao-pendencia-fornecedor-cor';
import { SituacaoPlanoAcaoFornecedorCor } from '@shared/models/enums/situacao-plano-acao-fornecedor-cor';
import { SituacaoQuestionarioFornecedorCor } from '@shared/models/enums/situacao-questionario-fornecedor-cor';
import { ToastrService } from 'ngx-toastr';
import { ModalDocumentoComponent } from '../modal-documento/modal-documento.component';

@Component({
  selector: 'item-fornecedor',
  templateUrl: './item-fornecedor.component.html',
  styleUrls: ['./item-fornecedor.component.scss']
})
export class ItemFornecedorComponent {
  @Input() fornecedor: FornecedorInteressado;
  @Input() fornecedoresSelecionados: Array<FornecedorInteressado>;
  @Output() removerFornecedor: EventEmitter<any> = new EventEmitter();
  @Output() ativar: EventEmitter<any> = new EventEmitter();
  @Output() inativar: EventEmitter<any> = new EventEmitter();
  @Output() auditoria: EventEmitter<any> = new EventEmitter();
  @Output() navigate: EventEmitter<any> = new EventEmitter();
  @Output() showDocumentos: EventEmitter<any> = new EventEmitter();
  @Input() disabled: boolean = false;

  public isHover: boolean = false;
  public statusFornecedorLabel = StatusFornecedorLabel;
  public situacaoDocumentoFornecedorCor = SituacaoDocumentoFornecedorCor;
  public situacaoQuestionarioFornecedorCor = SituacaoQuestionarioFornecedorCor;
  public situacaoPlanoAcaoFornecedorCor = SituacaoPlanoAcaoFornecedorCor;
  public situacaoPendenciaFornecedorCor = SituacaoPendenciaFornecedorCor;

  constructor(private modalService: NgbModal, private toastr: ToastrService) {}

  public solicitarRemoverFornecedor(fornecedor: FornecedorInteressado) {
    this.fornecedoresSelecionados.push(fornecedor);
    this.removerFornecedor.emit();
  }

  public solicitarAudicaoFornecedor() {
    this.auditoria.emit(this.fornecedor.idFornecedor);
  }

  public solicitarAtivacaoFornecedor() {
    this.ativar.emit(this.fornecedor.idPessoaJuridicaFornecedor);
  }

  public solicitarInativacaoFornecedor() {
    this.inativar.emit(this.fornecedor.idPessoaJuridicaFornecedor);
  }

  public navigateFor(path: any) {
    this.navigate.emit(
      `${this.fornecedor.idPessoaJuridicaFornecedor}/${path}/${this.fornecedor.idTenant}`
    );
  }

  public showModalDocumentos() {
    this.disabled = true;

    const modalRef = this.modalService.open(ModalDocumentoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'xl' as 'lg'
    });
    modalRef.componentInstance.fornecedor = this.fornecedor;

    modalRef.result.then(result => {
      this.disabled = false;
    });
  }

  get prefixoFraseDocumentos(): string {
    let sitDoc = this.fornecedor.situacaoDocumentoFornecedorCor;

    switch (sitDoc) {
      case SituacaoDocumentoFornecedorCor.Vencido:
      case SituacaoDocumentoFornecedorCor.Recusado:
      case SituacaoDocumentoFornecedorCor.Vencer:
      case SituacaoDocumentoFornecedorCor.NaoEnviado:
        return 'Há Documentos';
      case SituacaoDocumentoFornecedorCor.Novo:
        return 'Há';
      case SituacaoDocumentoFornecedorCor.Aprovado:
        return 'Todos os Documentos foram resolvidos';
      default:
        return 'Não há Documentos';
    }
  }

  get sufixoFraseDocumentos(): string {
    let sitDoc = this.fornecedor.situacaoDocumentoFornecedorCor;

    switch (sitDoc) {
      case SituacaoDocumentoFornecedorCor.Vencido:
      case SituacaoDocumentoFornecedorCor.Recusado:
      case SituacaoDocumentoFornecedorCor.Vencer:
      case SituacaoDocumentoFornecedorCor.NaoEnviado:
        return 'a serem tratados';
      case SituacaoDocumentoFornecedorCor.Novo:
        return 'Documentos a serem tratados';
      default:
        break;
    }
  }

  get fraseDocumento(): string {
    let sitDoc = this.fornecedor.situacaoDocumentoFornecedorCor;

    switch (sitDoc) {
      case SituacaoDocumentoFornecedorCor.Vencido:
      case SituacaoDocumentoFornecedorCor.Recusado:
        return 'Urgentes';
      case SituacaoDocumentoFornecedorCor.Vencer:
      case SituacaoDocumentoFornecedorCor.NaoEnviado:
        return 'Importantes';
      case SituacaoDocumentoFornecedorCor.Novo:
        return 'Novos';
      case SituacaoDocumentoFornecedorCor.Aprovado:
        break;
      default:
        break;
    }
  }

  get prefixoFraseQuestionario(): string {
    let sitDoc = this.fornecedor.situacaoQuestionarioFornecedorCor;

    switch (sitDoc) {
      case SituacaoQuestionarioFornecedorCor.Pendente:
      case SituacaoQuestionarioFornecedorCor.Andamento:
        return 'Há Questionários';
      case SituacaoQuestionarioFornecedorCor.Respondido:
        return 'Todos os Questionários foram Respondidos';
      default:
        return 'Não há Questionários';
    }
  }

  get sufixoFraseQuestionario(): string {
    let sitDoc = this.fornecedor.situacaoQuestionarioFornecedorCor;

    switch (sitDoc) {
      case SituacaoQuestionarioFornecedorCor.Pendente:
        return 'a serem tratados';
      default:
        break;
    }
  }

  get fraseQuestionario(): string {
    let sitDoc = this.fornecedor.situacaoQuestionarioFornecedorCor;

    switch (sitDoc) {
      case SituacaoQuestionarioFornecedorCor.Pendente:
        return 'Importantes';
      case SituacaoQuestionarioFornecedorCor.Andamento:
        return 'Em Andamento';
      case SituacaoQuestionarioFornecedorCor.Respondido:
        break;
      default:
        break;
    }
  }

  get prefixoFrasePlanoAcao(): string {
    let sitDoc = this.fornecedor.situacaoPlanoAcaoFornecedorCor;

    switch (sitDoc) {
      case SituacaoPlanoAcaoFornecedorCor.Atrasado:
      case SituacaoPlanoAcaoFornecedorCor.Pendente:
        return 'Há Planos de Ações';
      case SituacaoPlanoAcaoFornecedorCor.Andamento:
        return 'Há';
      case SituacaoPlanoAcaoFornecedorCor.Finalizado:
        return 'Todos os Planos de Ações foram Finalizados';
      default:
        return 'Não há Planos de Ações';
    }
  }

  get sufixoFrasePlanoAcao(): string {
    let sitDoc = this.fornecedor.situacaoPlanoAcaoFornecedorCor;

    switch (sitDoc) {
      case SituacaoPlanoAcaoFornecedorCor.Atrasado:
      case SituacaoPlanoAcaoFornecedorCor.Pendente:
        return 'a serem tratados';
      case SituacaoPlanoAcaoFornecedorCor.Andamento:
        return 'Planos de Ações a serem tratados';
      default:
        break;
    }
  }

  get frasePlanoAcao(): string {
    let sitDoc = this.fornecedor.situacaoPlanoAcaoFornecedorCor;

    switch (sitDoc) {
      case SituacaoPlanoAcaoFornecedorCor.Atrasado:
        return 'Urgentes';
      case SituacaoPlanoAcaoFornecedorCor.Pendente:
        return 'Importantes';
      case SituacaoPlanoAcaoFornecedorCor.Andamento:
        return 'Novos';
      case SituacaoPlanoAcaoFornecedorCor.Finalizado:
        break;
      default:
        break;
    }
  }

  get prefixoFrasePendencia(): string {
    let sitDoc = this.fornecedor.situacaoPendenciaFornecedorCor;

    switch (sitDoc) {
      case SituacaoPendenciaFornecedorCor.Pendente:
        return 'Há Pendências';
      case SituacaoPendenciaFornecedorCor.Resolvida:
        return 'Todas as Pendências foram resolvidos';
      default:
        return 'Não há Pendências';
    }
  }

  get sufixoFrasePendencia(): string {
    let sitDoc = this.fornecedor.situacaoPendenciaFornecedorCor;

    switch (sitDoc) {
      case SituacaoPendenciaFornecedorCor.Pendente:
        return 'a serem tratados';
      default:
        break;
    }
  }

  get frasePendencia(): string {
    let sitDoc = this.fornecedor.situacaoPendenciaFornecedorCor;

    switch (sitDoc) {
      case SituacaoPendenciaFornecedorCor.Pendente:
        return 'Importantes';
      case SituacaoPendenciaFornecedorCor.Resolvida:
        break;
      default:
        break;
    }
  }
}
