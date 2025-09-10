import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { SituacaoUsuarioLabel, Usuario } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../../shared/providers/usuario.service';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-item-usuario-fornecedor',
  templateUrl: './item-usuario-fornecedor.component.html',
  styleUrls: ['./item-usuario-fornecedor.component.scss'],
})
export class ItemUsuarioFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input() canDoActions: boolean = true;
  @Input() usuario: Usuario;
  @Input() idPessoaJuridica: number;
  @Output() obterUsuarios: EventEmitter<Usuario> = new EventEmitter<Usuario>();

  labelSituacao = SituacaoUsuarioLabel;
  disabled: boolean = false;
  usuarioAtual: Usuario;

  constructor(
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
  ) { }

  ngOnInit() {
    this.usuarioAtual = this.authService.usuario();
  }

  editaUsuarario() {
    if (!this.usuarioAtual.permissaoAtual.isSmarkets) {
      return;
    }

    const modalRef = this.modalService.open(ModalUsuarioComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    modalRef.componentInstance.idPessoaJuridica = this.idPessoaJuridica;
    modalRef.componentInstance.usuario = this.usuario;
    modalRef.result.then((result) => {
      if (result) {
        this.obterUsuarios.emit();
      }
    });
  }

  solicitarRemocaoVinculo(usuario: Usuario) {
    this.disabled = true;
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      windowClass: 'modal-desvinculo',
    });
    modalRef.componentInstance.confirmacao = `<p>Deseja realmente desvincular o <strong>${usuario.pessoaFisica.nome.toUpperCase()}</strong>?</p>`;
    modalRef.componentInstance.confirmarLabel = 'Desvincular';
    modalRef.componentInstance.html = true;
    modalRef.componentInstance.cancelarLabel = 'Cancelar';
    modalRef.result.then((result) => {
      if (result) {
        this.removerVinculo(usuario);
      }
      this.disabled = false;
    });
  }

  private removerVinculo(usuario: Usuario) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const idUsuario = usuario.idUsuario;
    const permissao = usuario.permissoes.filter(
      permissao => permissao.pessoaJuridica.idPessoaJuridica == this.idPessoaJuridica,
    );
    this.usuarioService.removerPermissoes(idUsuario, permissao).subscribe(
      (response) => {
        if (response) {
          this.obterUsuarios.emit();
        }
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  get situacao() {
    return this.labelSituacao.get(this.usuario.situacao);
  }

  get labelTootip() {
    return `${this.usuario.pessoaFisica.nome} ${this.labelSituacao.get(this.usuario.situacao)}`;
  }
}
