import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Situacao } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { PedidoService } from '../../../../../shared/providers/pedido.service';
import { PedidoObservacaoPadrao } from './../../../../../shared/models/pedido/pedido-observacao-padrao';

@Component({
  selector: 'app-observacoes-padrao',
  templateUrl: './observacoes-padrao.component.html',
  styleUrls: ['./observacoes-padrao.component.scss'],
})
export class ObservacoesPadraoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  pedidoObservacaoPadrao: PedidoObservacaoPadrao;
  situacao = Situacao;

  constructor(
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private pedidoService: PedidoService,
  ) { }

  ngOnInit() {
    this.construirFormulario();
    this.preencherFormulario(this.pedidoObservacaoPadrao);
  }

  cancelar() {
    this.activeModal.close();
  }

  salvar() {
    if (this.validaObservacaoPadrao()) {
      if (this.pedidoObservacaoPadrao.idPedidoObservacaoPadrao) {
        this.alterar(this.form.value);
      } else {
        this.inserir(this.form.value);
      }
    }
  }
  alterar(pedidoObservacaoPadrao: PedidoObservacaoPadrao) {
    this.blockUI.start();
    this.pedidoService.alterarObservacaoPadrao(pedidoObservacaoPadrao).subscribe(
      (response) => {
        if (response) {
          this.pedidoObservacaoPadrao.descricao = pedidoObservacaoPadrao.descricao;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.activeModal.close(this.pedidoObservacaoPadrao);
        }

        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      idPedidoObservacaoPadrao: [this.pedidoObservacaoPadrao.idPedidoObservacaoPadrao],
      descricao: ['', Validators.required],
      situacao: [this.pedidoObservacaoPadrao.situacao],
    });
  }

  private preencherFormulario(pedidoObservacaoPadrao: PedidoObservacaoPadrao) {
    this.form.patchValue(pedidoObservacaoPadrao);
  }

  private validaObservacaoPadrao(): Boolean {
    const form = this.form.value;
    if (form.descricao == null || form.descricao.trim() === '') {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }

  private inserir(pedidoObservacaoPadrao: PedidoObservacaoPadrao) {
    this.blockUI.start();
    pedidoObservacaoPadrao.idPedidoObservacaoPadrao = 0;
    pedidoObservacaoPadrao.situacao = this.situacao.Ativo;
    this.pedidoService.inserirObservacaoPadrao(pedidoObservacaoPadrao).subscribe(
      (response) => {
        if (response) {
          this.pedidoObservacaoPadrao = response;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.activeModal.close(this.pedidoObservacaoPadrao);
        }

        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
