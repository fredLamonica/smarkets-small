import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Endereco, TipoEnderecoLabel } from '@shared/models';
import { AutenticacaoService, EnderecoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ManterEnderecoComponent } from '../../input-enderecos/manter-endereco/manter-endereco.component';
import { ModalConfirmacaoExclusao } from '../../modals/confirmacao-exclusao/confirmacao-exclusao.component';

@Component({
  selector: 'item-endereco',
  templateUrl: './item-endereco.component.html',
  styleUrls: ['./item-endereco.component.scss'],
})
export class ItemEnderecoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input() endereco: Endereco;
  @Input() canEditAddress: boolean = true;
  @Output() obterEnderecos: EventEmitter<Endereco> = new EventEmitter<Endereco>();
  tipoEndereco = TipoEnderecoLabel;
  disabled: boolean = false;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private enderecoService: EnderecoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private authService: AutenticacaoService,
  ) {}

  ngOnInit() {}

  editarEndereco() {
    if (this.canEditAddress) {
      const modalRef = this.modalService.open(ManterEnderecoComponent, {
        centered: true,
        size: 'lg',
        backdrop: 'static',
      });

      modalRef.componentInstance.endereco = this.endereco;
      modalRef.result.then((result) => {
        if (result) {
          const endereco = <Endereco>result;
          this.enderecoService
            .alterar(endereco)
            .toPromise()
            .then(result => {
              if (result) {
                this.obterEnderecos.emit();
                this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              }
            });
        }
      });
    }
  }

  // #region Exclusao de Endereco
  solicitarExclusao() {
    if (this.canEditAddress) {
      this.disabled = true;
      const modalRef = this.modalService
        .open(ModalConfirmacaoExclusao, { centered: true })
        .result.then(
          (result) => this.excluir(this.endereco),
          (reason) => {
            this.disabled = false;
          },
        );
    }
  }

  private excluir(endereco: Endereco) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.enderecoService.deletarBatch([endereco]).subscribe(
      (resultado) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.obterEnderecos.emit();
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
  // //#endregion

  get enderecoLabel() {
    return `${this.endereco.logradouro} ${this.endereco.numero}`;
  }
}
