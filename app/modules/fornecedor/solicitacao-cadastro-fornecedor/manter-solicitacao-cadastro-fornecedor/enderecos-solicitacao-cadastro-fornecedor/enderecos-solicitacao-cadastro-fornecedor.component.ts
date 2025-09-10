import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { ManterEnderecoModalComponent } from '@shared/components/modals/manter-endereco-modal/manter-endereco-modal.component';
import { Endereco, EnderecoDto, TipoEndereco, Usuario } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { SolicitacaoCadastroFornecedorService } from '@shared/providers/solicitacao-cadastro-fornecedor.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'enderecos-solicitacao-cadastro-fornecedor',
  templateUrl: './enderecos-solicitacao-cadastro-fornecedor.component.html',
  styleUrls: ['./enderecos-solicitacao-cadastro-fornecedor.component.scss'],
})
export class EnderecosSolicitacaoCadastroFornecedorComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  TipoEndereco = TipoEndereco;
  iconSpotColor = '#52BDE9';
  iconSpotColorHover = '#27ADE4';
  borderColor = '#B8CAD1';
  borderWidth = '1px';
  borderStyle = 'solid';
  borderColorHover = '#3DB5E7';
  rectangleButtonColor = '#C4C4C4';
  idSolicitacaoFornecedor: number;
  enderecos: Array<Endereco>;
  usuarioSolicitante: boolean = true;

  get tiposEnderecosDisponiveis(): Array<TipoEndereco> {
    if (this.enderecos && this.enderecos.filter((t) => t.tipo !== TipoEndereco.Entrega)) {
      const itens = this.enderecos.filter((end) => end.tipo !== TipoEndereco.Entrega);

      itens.forEach((item) => {
        const index = this._tiposEnderecosDisponiveis.indexOf(item.tipo);

        if (index !== -1) {
          this._tiposEnderecosDisponiveis.splice(index, 1);
        }
      });
    }
    return this._tiposEnderecosDisponiveis;
  }

  private _tiposEnderecosDisponiveis: Array<TipoEndereco>;

  constructor(
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private solicitacaoCadastroFornecedorService: SolicitacaoCadastroFornecedorService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private autenticacaoService: AutenticacaoService,
  ) {
    super();
  }

  ngOnInit() {
    this.idSolicitacaoFornecedor = this.route.snapshot.params['id'];
    this.setTiposEnderecosDisponiveis();
    this.obterEnderecos();
  }

  obterEnderecos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.solicitacaoCadastroFornecedorService.getUsuarioSolicitante(this.idSolicitacaoFornecedor).pipe(
      takeUntil(this.unsubscribe),
      switchMap((usuario) => {
        const usuarioLogado: Usuario = this.autenticacaoService.usuario();

        if (usuarioLogado && usuarioLogado.permissaoAtual && usuarioLogado.permissaoAtual.idUsuario !== usuario.idUsuario) {
          this.usuarioSolicitante = false;
        }

        return this.solicitacaoCadastroFornecedorService.getAdress(this.idSolicitacaoFornecedor);
      }))
      .subscribe(
        (response) => {
          if (response) {
            this.enderecos = response;
            this.setTiposEnderecosDisponiveis();
          } else {
            this.enderecos = new Array<Endereco>();
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  onClickDelete(event: Event, idSolicitacaoFornecedorEndereco: number) {
    event.preventDefault();
    event.stopPropagation();
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.delete(idSolicitacaoFornecedorEndereco),
        (reason) => { },
      );
  }

  IncludeAddress() {
    const modalRef = this.modalService.open(ManterEnderecoModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      windowClass: 'modal-manter-endereco',
    });
    modalRef.componentInstance.tiposEnderecos = this.tiposEnderecosDisponiveis;
    // modalRef.componentInstance.idPessoa = this.idPessoa;
    modalRef.componentInstance.hasAddress = this.enderecos.length > 0;
    modalRef.result.then((result) => {
      if (result) {
        const endereco = <EnderecoDto & Endereco>result;

        this.temEnderecoInstitucional(endereco);
        this.temEnderecoInstitucional(endereco);
        const enderecoDto: EnderecoDto = {
          enderecobase: endereco,
          tipos: endereco.tipos,
        };
        this.solicitacaoCadastroFornecedorService
          .insertAdress(enderecoDto, this.idSolicitacaoFornecedor)
          .toPromise()
          // tslint:disable-next-line: no-shadowed-variable
          .then((result) => {
            if (result) {
              this.obterEnderecos();
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            }
          });
      }
    });
  }

  edit(endereco: Endereco) {
    const modalRef = this.modalService.open(ManterEnderecoModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      windowClass: 'modal-manter-endereco',
    });

    modalRef.componentInstance.endereco = endereco;
    modalRef.result.then((result) => {
      if (result) {
        // tslint:disable-next-line: no-shadowed-variable
        const endereco = <Endereco>result;

        this.solicitacaoCadastroFornecedorService
          .updateAdress(endereco)
          .toPromise()
          // tslint:disable-next-line: no-shadowed-variable
          .then((result) => {
            if (result) {
              this.obterEnderecos();
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            }
          });
      }
    });
  }

  private setTiposEnderecosDisponiveis() {
    this._tiposEnderecosDisponiveis = [
      TipoEndereco.Cobrança,
      TipoEndereco.Entrega,
      TipoEndereco.Faturamento,
      TipoEndereco.Institucional,
    ];
  }

  private delete(idSolicitacaoFornecedorEndereco: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCadastroFornecedorService.deleteAdress(idSolicitacaoFornecedorEndereco).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.obterEnderecos();
        },
        (error) => {
          this.toastr.error(error.error);
          this.blockUI.stop();
        },
      );
  }

  private temEnderecoInstitucional(endereco: EnderecoDto) {
    if (
      !this.enderecos.find((e) => e.tipo === TipoEndereco.Institucional) &&
      !endereco.tipos.find((t) => t === TipoEndereco.Institucional)
    ) {
      endereco.tipos.push(TipoEndereco.Institucional);
    }
  }
}
