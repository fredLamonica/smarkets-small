import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoItem, ContaContabil, PerfilUsuario, TipoCatalogoItem, TipoFrete, Usuario } from '@shared/models';
import { AutenticacaoService, CatalogoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-detalhes-produto',
  templateUrl: './detalhes-produto.component.html',
  styleUrls: ['./detalhes-produto.component.scss'],
})
export class DetalhesProdutoComponent extends Unsubscriber implements OnInit {

  @Input() fornecedor: boolean = false;

  usuario: Usuario;
  form: FormGroup = this.contruirFormulario();
  catalogoItem = new Object() as CatalogoItem;
  @BlockUI() blockUI: NgBlockUI;
  idContratoCatalogoItem: number;
  idProduto: number;
  TipoFrete = TipoFrete;
  TipoCatalogoItem = TipoCatalogoItem;
  PerfilUsuario = PerfilUsuario;
  urlImgSelected: string;
  isLoading: boolean;
  contasContabeis: string = '';
  ocultarBtnAdicionarCarrinho: boolean;
  ocultarUnidadeMedida: boolean;
  ocultarNcm: boolean;
  ocultarIdProduto: boolean;
  ocultarContaContabil: boolean;

  constructor(
    private catalogoService: CatalogoService,
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private authService: AutenticacaoService,
  ) {
    super();
  }

  ngOnInit() {
    this.usuario = this.authService.usuario();
    this.obterDetalhes();
  }

  fechar() {
    this.activeModal.close();
  }

  excluirArquivo(arg) { }

  adicionarCarrinho() {
    if (this.usuario.permissaoAtual.perfil !== PerfilUsuario.Cadastrador) {
      this.activeModal.close(this.catalogoItem);
    } else {
      this.toastr.warning('Você não tem acesso a realizar esta ação.');
    }
  }

  selectImage(url: string): void {
    this.urlImgSelected = url;
  }

  preencheContasContabeis(contasContabeis: Array<ContaContabil>): void {
    if (contasContabeis.length !== 0) {
      for (let i = 0, l = (contasContabeis.length > 5 ? 5 : contasContabeis.length); i < l; ++i) {
        if (i !== l - 1) {
          this.contasContabeis += contasContabeis[i].descricao + ', ';
        } else {
          this.contasContabeis += contasContabeis[i].descricao;
        }
      }
    } else {
      this.contasContabeis = '--';
    }
  }

  private obterDetalhes() {
    this.isLoading = true;
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.idContratoCatalogoItem) {
      this.catalogoService.obterDetalhesCatalogo(this.idContratoCatalogoItem).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.isLoading = false;
          this.blockUI.stop();
        }))
        .subscribe(
          (response) => {
            this.catalogoItem = response;
            this.catalogoItem.contratoCatalogoItem.stringEstadosAtendimento = this.catalogoItem.contratoCatalogoItem.estadosAtendimento
              .map((estadoAtendimento) => estadoAtendimento.estado.abreviacao)
              .join(', ');

            this.preencheContasContabeis(this.catalogoItem.contratoCatalogoItem.produto.contasContabeis);

            if (this.catalogoItem.contratoCatalogoItem.produto.imagens.length > 0) {
              this.selectImage(this.catalogoItem.contratoCatalogoItem.produto.imagens[0].url);
            }
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    } else {
      this.catalogoService.obterDetalhesRequisicao(this.idProduto).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.isLoading = false;
          this.blockUI.stop();
        }))
        .subscribe(
          (response) => {
            this.catalogoItem = response;

            this.preencheContasContabeis(this.catalogoItem.produto.contasContabeis);

            if (this.catalogoItem.produto.imagens.length > 0) {
              this.selectImage(this.catalogoItem.produto.imagens[0].url);
            }
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }

  private contruirFormulario() {
    return this.fb.group({
      idConfiguracaoVisitaTecnica: [0],
      questao: [''],
      tipo: [1],
      impacto: null,
      idTenant: [0],
    });
  }
}
