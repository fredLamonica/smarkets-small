import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemSolicitacaoCompra, PerfilUsuario } from '@shared/models';
import { SolicitacaoCompraService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-usuario-responsavel-solicitacao-compra',
  templateUrl: './manter-usuario-responsavel-solicitacao-compra.component.html',
  styleUrls: ['./manter-usuario-responsavel-solicitacao-compra.component.scss'],
})
export class ManterUsuarioResponsavelSolicitacaoCompraComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  itemSolicitacaoCompra: ItemSolicitacaoCompra;
  form: FormGroup;
  usuarios: Array<any>;

  constructor(
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    public solicitacaoCompraService: SolicitacaoCompraService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idSolicitacaoCompra: [this.itemSolicitacaoCompra.idSolicitacaoCompra],
      idResponsavel: [this.itemSolicitacaoCompra.idResponsavel],
      nomeComprador: [this.itemSolicitacaoCompra.nomeResponsavel],
    });

    this.obterUsuarios();
  }

  alterarResponsavel() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const responsavelCompradorDto = this.form.value;

    this.solicitacaoCompraService.alterarResponsavel(responsavelCompradorDto).subscribe(
      (response) => {
        if (response) {
          this.preenchaResponsavelComprador();
          this.blockUI.stop();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.activeModal.close(this.itemSolicitacaoCompra);
        } else {
          this.blockUI.stop();
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private preenchaResponsavelComprador() {
    this.itemSolicitacaoCompra.idResponsavel = this.form.value.idResponsavel;
    this.itemSolicitacaoCompra.nomeResponsavel = this.form.value.nomeComprador
  }

  obterUsuarios() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.usuarioService.obterPorPerfil(PerfilUsuario.Gestor).subscribe(
      (response) => {
        if (response) {
          this.usuarios = response.map(r => (
            {
              idUsuario: r.idUsuario,
              nome: r.pessoaFisica.nome
            }
          ));
        }
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  cancelar() {
    this.activeModal.close();
  }
}
