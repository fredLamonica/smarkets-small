import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs-compat';
import { finalize, takeUntil } from 'rxjs/operators';
import { ConfiguracoesDto } from '../../../shared/models';
import { PessoaJuridicaService, TranslationLibraryService } from '../../../shared/providers';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'manter-configuracao-empresa',
  templateUrl: './manter-configuracao-empresa.component.html',
  styleUrls: ['./manter-configuracao-empresa.component.scss'],
})
export class ManterConfiguracaoEmpresaComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  idPessoaJuridica: number;
  configuracoesPessoaJuridica: ConfiguracoesDto;
  paramsSub: Subscription;
  configuracoes = new Array<{ icone: string, titulo: string, texto: string, rota: string }>();

  private possuiCompraAutomatizada: boolean = true;

  constructor(
    private errorService: ErrorService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private route: ActivatedRoute,
    private router: Router,
    private translationLibrary: TranslationLibraryService,

  ) {
    super();
  }

  ngOnInit() {
    this.inicialize();
  }

  carregarModulos() {
    this.obterConfiguracoesPessoaJuridica();
  }

  abrirConfiguracoes(rota: string) {
    this.router.navigate([rota, this.idPessoaJuridica], { relativeTo: this.route });
  }

  private inicialize(): void {
    this.obterParametros();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idPessoaJuridica = +params['idPessoaJuridica'];

        if (this.idPessoaJuridica) {
          this.obterConfiguracoesPessoaJuridica();
        }

      });
  }

  private inicializeConfiguracoes(): void {
    this.configuracoes.push(
      {
        icone: 'fas fa-cog',
        titulo: 'Plataforma',
        rota: '../plataforma',
        texto: `Configure e habilite os módulos para utilização da plataforma e experiência no fluxo de compras.`,
      });

    this.configuracoes.push(
      {
        icone: 'fas fa-server',
        titulo: 'Integrações',
        rota: '../integracao',
        texto: `Configure a integração da sua empresa, como, API, ERP e SAP.`,
      });

    if (this.configuracoesPessoaJuridica.habilitarCompraAutomatizada) {
      this.configuracoes.push(
        {
          icone: 'fas fa-robot',
          titulo: 'Compra Automatizada',
          rota: '../compra-automatizada',
          texto: `Habilite a compra automatizada em Catálogo e ou Cotação, configure de acordo com as regras desejadas.`,
        });
    }
  }

  private obterConfiguracoesPessoaJuridica() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pessoaJuridicaService.obterConfiguracoes(this.idPessoaJuridica).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (configuracoes) => {
          this.configuracoesPessoaJuridica = configuracoes;
          this.inicializeConfiguracoes();
        },
        (error) => this.errorService.treatError(error),
      );
  }

}
