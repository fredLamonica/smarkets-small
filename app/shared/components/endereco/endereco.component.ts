import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Endereco, EnderecoDto, PerfilUsuario, TipoEndereco, Usuario } from '@shared/models';
import {
  AutenticacaoService,
  EnderecoService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ManterEnderecoComponent } from '../input-enderecos/manter-endereco/manter-endereco.component';
import { ModalConfirmacaoExclusao } from '../modals/confirmacao-exclusao/confirmacao-exclusao.component';
import { ManterEnderecoModalComponent } from '../modals/manter-endereco-modal/manter-endereco-modal.component';

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrls: ['./endereco.component.scss'],
})
export class EnderecoComponent implements OnInit {

  get tiposEnderecosDisponiveis(): Array<TipoEndereco> {
    if (this.enderecos && this.enderecos.filter(t => t.tipo != TipoEndereco.Entrega)) {
      const itens = this.enderecos.filter(end => end.tipo != TipoEndereco.Entrega);
      itens.forEach(item => {
        let index = this._tiposEnderecosDisponiveis.indexOf(item.tipo);
        if (index != -1) this._tiposEnderecosDisponiveis.splice(index, 1);
      });
    }
    return this._tiposEnderecosDisponiveis;
  }
  @BlockUI() blockUI: NgBlockUI;

  @Input() isBuyer = false;
  public idPessoaJuridica: number;
  public idPessoa: number;
  public enderecos: Array<Endereco>;
  public disabled: boolean = false;
  TipoEndereco = TipoEndereco;
  iconSpotColor = '#52BDE9';
  iconSpotColorHover = '#27ADE4';
  borderColor = '#B8CAD1';
  borderWidth = '1px';
  borderStyle = 'solid';
  borderColorHover = '#3DB5E7';
  rectangleButtonColor = '#C4C4C4';

  private idTenantFornecedor: number | null;
  private currentUser: Usuario;

  private _tiposEnderecosDisponiveis: Array<TipoEndereco>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private enderecoService: EnderecoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private pessoaJuridicaService: PessoaJuridicaService,
    private authService: AutenticacaoService
  ) {}

  ngOnInit() {
    this.idTenantFornecedor = parseInt(this.route.snapshot.params.idTenantFornecedor) || null;
    this.currentUser = this.authService.usuario();

    this.defineOnReadyStateChange();
    this.idPessoaJuridica = this.route.parent.snapshot.params.id;
    this.getPessoaId();
    this.obterEnderecos();
    this.setTiposEnderecosDisponiveis();
  }

  public obterEnderecos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.enderecoService.obterEnderecoPorPessoaJuridica(this.idPessoaJuridica).subscribe(
      response => {
        if (response) {
          if (this.isBuyer) {
            this.tryDefineOnResize();
          }
          this.enderecos = response;
          this.setTiposEnderecosDisponiveis();
        } else {
          this.enderecos = new Array<Endereco>();
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
  //#região Manter Endereco

  public incluirEndereco() {
    const modalRef = this.modalService.open(ManterEnderecoComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.idPessoa = this.idPessoa;
    modalRef.componentInstance.tiposEnderecos = this.tiposEnderecosDisponiveis;
    modalRef.componentInstance.hasAddress = this.enderecos.length > 0;
    modalRef.result.then(result => {
      if (result) {
        let endereco = <EnderecoDto & Endereco>result;
        endereco.idPessoa = this.idPessoa;
        this.temEnderecoInstitucional(endereco);
        const enderecoDto: EnderecoDto = {
          enderecobase: endereco,
          tipos: endereco.tipos
        };

        this.enderecoService
          .inserir(enderecoDto)
          .toPromise()
          .then(result => {
            if (result) {
              this.obterEnderecos();
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            }
          });
      }
    });
  }

  public onClickDelete(event: Event, idEndereco: number) {
    event.preventDefault();
    event.stopPropagation();
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.delete(idEndereco),
        reason => {}
      );
  }

  public edit(endereco: Endereco) {
    const modalRef = this.modalService.open(ManterEnderecoModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      windowClass: 'modal-manter-endereco'
    });

    modalRef.componentInstance.endereco = endereco;
    modalRef.result.then(result => {
      if (result) {
        const endereco = <Endereco>result;
        this.enderecoService
          .alterar(endereco)
          .toPromise()
          .then(result => {
            if (result) {
              this.obterEnderecos();
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            }
          });
      }
    });
  }

  public IncludeAddress() {
    const modalRef = this.modalService.open(ManterEnderecoModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      windowClass: 'modal-manter-endereco'
    });
    modalRef.componentInstance.idPessoa = this.idPessoa;
    modalRef.componentInstance.tiposEnderecos = this.tiposEnderecosDisponiveis;
    modalRef.componentInstance.hasAddress = this.enderecos.length > 0;
    modalRef.result.then(result => {
      if (result) {
        let endereco = <EnderecoDto & Endereco>result;
        endereco.idPessoa = this.idPessoa;
        this.temEnderecoInstitucional(endereco);
        const enderecoDto: EnderecoDto = {
          enderecobase: endereco,
          tipos: endereco.tipos
        };

        this.enderecoService
          .inserir(enderecoDto)
          .toPromise()
          .then(result => {
            if (result) {
              this.obterEnderecos();
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            }
          });
      }
    });
  }

  public resize() {
    var menu = document.getElementById('menu');
    var cardEndereco = document.getElementById('card-endereco');

    var div_menu = menu.children[0].clientHeight + menu.children[1].children[0].clientHeight;

    cardEndereco.style.minHeight = div_menu + 'px';
  }

  public canEditAdress() {
    let isSupplierProfile =
      !this.idTenantFornecedor &&
      this.currentUser.permissaoAtual.perfil == PerfilUsuario.Fornecedor;

    let isMineSupplier = this.idTenantFornecedor
      ? this.idTenantFornecedor == this.currentUser.permissaoAtual.idTenant
      : false;

    return isSupplierProfile || isMineSupplier;
  }

  private setTiposEnderecosDisponiveis() {
    this._tiposEnderecosDisponiveis = [
      TipoEndereco.Cobrança,
      TipoEndereco.Entrega,
      TipoEndereco.Faturamento,
      TipoEndereco.Institucional
    ];
  }

  private getPessoaId() {
    this.pessoaJuridicaService.obterPessoaId(this.idPessoaJuridica).subscribe(
      response => {
        if (response) {
          this.idPessoa = response;
          if (this.isBuyer) {
            this.tryDefineOnResize();
          }
        }
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }
  //#endregion

  private temEnderecoInstitucional(endereco: EnderecoDto) {
    if (
      !this.enderecos.find(e => e.tipo == TipoEndereco.Institucional) &&
      !endereco.tipos.find(t => t == TipoEndereco.Institucional)
    ) {
      endereco.tipos.push(TipoEndereco.Institucional);
    }
  }

  private delete(idEndereco: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.enderecoService.deletar(idEndereco).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.obterEnderecos();
      },
      error => {
        this.toastr.error(error.error);
        this.blockUI.stop();
      }
    );
  }

  private defineOnReadyStateChange() {
    if (this.isBuyer) {
      document.onreadystatechange = this.tryDefineOnResize.bind(this);
    }
  }

  private tryDefineOnResize() {
    if (document.readyState === 'complete') {
      window.onresize = this.resize.bind(this);
      this.resize();
    }
  }
}
