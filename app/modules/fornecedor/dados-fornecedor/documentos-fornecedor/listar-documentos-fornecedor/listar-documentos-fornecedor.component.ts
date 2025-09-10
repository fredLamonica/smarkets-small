import { AuditoriaComponent } from '@shared/components';
import { SolicitacaoDocumentoFornecedorArquivoService } from '@shared/providers';
import {
  SolicitacaoDocumentoFornecedorArquivo,
  StatusSolicitacaoDocumentoFornecedor,
  SituacaoValidacaoDocumentoFornecedor
} from '@shared/models';
import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '@shared/providers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ManterDocumentosFornecedorComponent } from '../manter-documentos-fornecedor/manter-documentos-fornecedor.component';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';

@Component({
  selector: 'listar-documentos-fornecedor',
  templateUrl: './listar-documentos-fornecedor.component.html',
  styleUrls: ['./listar-documentos-fornecedor.component.scss']
})
export class ListarDocumentosFornecedorComponent implements OnInit, OperacoesFiltro {
  public solicitacaoDocumentosFornecedorArquivos: Array<SolicitacaoDocumentoFornecedorArquivo>;
  StatusSolicitacaoDocumentoFornecedor: typeof StatusSolicitacaoDocumentoFornecedor =
    StatusSolicitacaoDocumentoFornecedor;
  public SituacaoValidacaoDocumentoFornecedor = SituacaoValidacaoDocumentoFornecedor;

  constructor(
    private modalService: NgbModal,
    private solicitacaoDocumentoFornecedorArquivoService: SolicitacaoDocumentoFornecedorArquivoService,
    private authService: AutenticacaoService,
    private datePipe: DatePipe
  ) {}

  ResetPagination() {
    throw new Error('Method not implemented.');
  }

  Hydrate(termo?: string) {
    throw new Error('Method not implemented.');
  }

  onScroll(termo?: string) {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    let idPessoaJuridicaFornecedor =
      this.authService.usuario().permissaoAtual.pessoaJuridica.idPessoaJuridica;
    this.solicitacaoDocumentoFornecedorArquivoService
      .obterDocumentos(idPessoaJuridicaFornecedor)
      .subscribe(response => {
        this.solicitacaoDocumentosFornecedorArquivos = response;
      });
  }

  public abrirModalDeEdicao(
    solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo
  ) {
    const modalRef = this.modalService.open(ManterDocumentosFornecedorComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.solicitacaoDocumentoFornecedorArquivo =
      solicitacaoDocumentoFornecedorArquivo;

    modalRef.result.then(result => {
      if (result) {
        this.solicitacaoDocumentosFornecedorArquivos.find(
          f => f.documentoFornecedor.idDocumentoFornecedor == result.idDocumentoFornecedor
        ).statusSolicitacaoDocumentoFornecedor = result.statusSolicitacaoDocumentoFornecedor;
      }
    });
  }

  public abrirModalDeAuditoria(
    solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo
  ) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'SolicitacaoDocumentoFornecedorArquivo';
    modalRef.componentInstance.idEntidade =
      solicitacaoDocumentoFornecedorArquivo.documentoFornecedor.idDocumentoFornecedor;
  }

  public formatarData(data: Date): string {
    if (data) {
      return this.datePipe.transform(data, 'dd/MM/yyyy');
    }

    return null;
  }

  public obterCor(solicitacaoDocumentoFornecedorArquivo: SolicitacaoDocumentoFornecedorArquivo) {
    if (solicitacaoDocumentoFornecedorArquivo.dataVencimento != null) {
      let validadeEmDias = this.obterValidadeEmDias(
        solicitacaoDocumentoFornecedorArquivo.dataVencimento
      );
      if (validadeEmDias < 16) return { color: 'red' };

      if (validadeEmDias >= 16 && validadeEmDias <= 30) return { color: 'yellow' };

      return { color: 'black' };
    }
  }

  private obterValidadeEmDias(dataVencimento: Date) {
    let diferenca = Math.abs(new Date(dataVencimento).getTime() - this.obterDataAtual().getTime());
    let diferencaEmDias = Math.ceil(diferenca / (1000 * 3600 * 24));
    return diferencaEmDias;
  }

  private obterDataAtual() {
    let data = new Date();
    this.datePipe.transform(data, 'dd/MM/yyyy');
    return data;
  }
}
