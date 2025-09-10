import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { PerfilUsuario, Situacao } from '@shared/models';
import { PedidoObservacaoPadrao } from '@shared/models/pedido/pedido-observacao-padrao';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { PedidoService } from '../../../../shared/providers/pedido.service';
import { ObservacoesPadraoComponent } from './observacoes-padrao/observacoes-padrao.component';

@Component({
  selector: 'configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss'],
})
export class ConfiguracoesComponent implements OnInit {

  get exibirCriterioDeAvaliacao() {
    return PerfilUsuario.Gestor !== this.perfil;
  }
  @BlockUI() blockUI: NgBlockUI;

  pedidoObservacaoPadrao = new PedidoObservacaoPadrao();
  situacao = Situacao;
  perfil: PerfilUsuario;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private pedidoService: PedidoService,
    private authService: AutenticacaoService,
  ) { }

  ngOnInit() {
    this.obterObservacoesPadrao();
    this.perfil = this.authService.perfil();
  }

  editarCriterioAvaliacaoPedido() {
    this.router.navigate(['/pedidos/configuracoes/criterioavaliacaopedido'], {
      relativeTo: this.route,
    });
  }

  obterObservacoesPadrao() {
    this.blockUI.start();
    this.pedidoService.obterObservacaoPadraoPorIdTenant().subscribe(
      (response) => {
        if (response) {
          this.pedidoObservacaoPadrao = response;
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  editarObservacoesPadrao() {
    this.observacoesPadraoModal();
  }

  ativar(pedidoObservacaoPadrao: PedidoObservacaoPadrao) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao =
      'Tem certeza que deseja ativar essa observação padrão?';
    modalRef.result.then((result) => {
      if (result) {
        pedidoObservacaoPadrao.situacao = this.situacao.Ativo;
        this.alterarObservacaoPadrao(pedidoObservacaoPadrao);
      }
    });
  }

  inativar(pedidoObservacaoPadrao: PedidoObservacaoPadrao) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao =
      'Tem certeza que deseja desativar essa observação padrão?';
    modalRef.result.then((result) => {
      if (result) {
        pedidoObservacaoPadrao.situacao = this.situacao.Inativo;
        this.alterarObservacaoPadrao(pedidoObservacaoPadrao);
      }
    });
  }

  alterarObservacaoPadrao(pedidoObservacaoPadrao: PedidoObservacaoPadrao) {
    this.blockUI.start();
    this.pedidoService.alterarObservacaoPadrao(pedidoObservacaoPadrao).subscribe(
      (response) => {
        if (response) {
          this.pedidoObservacaoPadrao = pedidoObservacaoPadrao;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        }

        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private observacoesPadraoModal() {
    const modalRef = this.modalService.open(ObservacoesPadraoComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
    });
    modalRef.componentInstance.pedidoObservacaoPadrao = this.pedidoObservacaoPadrao;

    modalRef.result.then((result) => {
      if (result) {
        this.pedidoObservacaoPadrao = result;
      }
    });
  }
}
