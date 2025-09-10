import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsList } from '@ng-select/ng-select/ng-select/items-list';
import { PerfilUsuario, TipoDocumentoFornecedor } from '@shared/models';
import { InfosFornecedor } from '@shared/models/dto/infos-fornecedor';
import {
  AutenticacaoService,
  FornecedorService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Rx';

interface listItem {
  label: string;
  url: string;
}

@Component({
  selector: 'manter-fornecedor-novo',
  templateUrl: './manter-fornecedor-novo.component.html',
  styleUrls: ['./manter-fornecedor-novo.component.scss']
})
export class ManterFornecedorNovoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  isForm = false;

  public itens: listItem[] = [
    { label: 'DADOS GERAIS', url: 'dados-gerais' },
    { label: 'ENDEREÇOS', url: 'enderecos' },
    { label: 'DOCUMENTOS', url: 'documentos' },
    { label: 'USUÁRIOS', url: 'usuarios' },
    { label: 'INFORMAÇÕES BANCÁRIAS', url: 'domicilios-bancarios' },
    { label: 'CNAEs', url: 'cnaes' },
    { label: 'PENDÊNCIAS', url: 'pendencias' },
    { label: 'PLANO DE AÇÃO', url: 'planos-acao' },
    { label: 'QUESTIONÁRIOS', url: 'questionarios' }
  ];
  tipoDocumentoSelecionado: TipoDocumentoFornecedor;
  infosFornecedor: InfosFornecedor = new InfosFornecedor();
  private routeSub: Subscription;
  private subscription: Subscription;

  constructor(
    private authService: AutenticacaoService,
    private fornecedorService: FornecedorService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.obterInfosFornecedor(+params['id']);
    });
    this.obterBackgroundColor();
  }

  private async obterBackgroundColor() {
    this.subscription = this.route.firstChild.url.subscribe(urls => {
      this.verificarFormulario(urls[0].path);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.subscription.unsubscribe();
  }

  // obterInfosFornecedor() pega as poucas informações sobre o Fornecedor, e lá no backend é recuperado o Tenant do usuário atual para saber de qual fornecedor estamos falando.
  private obterInfosFornecedor(idPessoaJuridicaFornecedor: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.obterInfosFornecedor(idPessoaJuridicaFornecedor).subscribe(
      response => {
        if (response) {
          this.infosFornecedor = response;
          if (response.cnpj.length > 14)
            this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cnpj;
          else {
            this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cpf;
          }
          this.blockUI.stop();
        }
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public voltar() {
    this.router.navigate(['/']);
  }

  public verificarFormulario(url: string) {
    switch (url) {
      case 'dados-gerais':
        this.isForm = true;
        break;
      default:
        this.isForm = false;
        break;
    }
  }
}
