import { Component, OnInit } from '@angular/core';
import { TranslationLibraryService, CotacaoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Cotacao, Moeda } from '@shared/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manter-aceite-fornecedor',
  templateUrl: './manter-aceite-fornecedor.component.html',
  styleUrls: ['./manter-aceite-fornecedor.component.scss']
})
export class ManterAceiteFornecedorComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public Moeda = Moeda;
  
  public idCotacao: number;
  public cotacao: Cotacao;

  public form: FormGroup;

  private paramsSub: Subscription;

  public aceite: boolean = false;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cotacaoService: CotacaoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.obterParametros();
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(
      params => {
        this.idCotacao = params["idCotacao"];

        if (this.idCotacao)
          this.obterCotacao();
      }
    );
  }

  private obterCotacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService.obterPorId(this.idCotacao).subscribe(
      response => {
        if (response)
          this.cotacao = response;

        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public participar() {
    if(this.aceite) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.cotacaoService.aceitarTermos(this.idCotacao).subscribe(
        response => {
          this.blockUI.stop();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.router.navigate(['/acompanhamentos', 'cotacoes', this.cotacao.idCotacao, 'propostas']);
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    } else {
      this.toastr.warning("Para participar do processo de cotação é necessário concordar com os termos e condições da cotação.");
      this.blockUI.stop();
    }
  }

  public voltar() {
    this.router.navigate(['/acompanhamentos'], { queryParams: { aba: "cotacoes" } });
  }

}
