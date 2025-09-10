import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanoAcaoFornecedor, StatusPlanoAcaoFornecedor } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { PlanoAcaoFornecedorService } from './../../../shared/providers/plano-acao-fornecedor.service';

@Component({
  selector: 'plano-acao',
  templateUrl: './plano-acao.component.html',
  styleUrls: ['./plano-acao.component.scss']
})
export class PlanoAcaoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public planos: Array<PlanoAcaoFornecedor>;

  @Input() idPessoaJuridicaFornecedor: number;
  @Input() habilitarPlanoDeAcoes: boolean = true;
  public StatusPlanoAcaoFornecedor = StatusPlanoAcaoFornecedor;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private planoAcaoFornecedorService: PlanoAcaoFornecedorService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obterPlanosAcoes();
  }

  private obterPlanosAcoes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.planoAcaoFornecedorService
      .listarPorIdPessoaJuridica(this.idPessoaJuridicaFornecedor)
      .subscribe(
        response => {
          this.planos = response ? response : [];
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public atualizarPlanoAcao(idPlanoAcao: number) {
    
    //:idPessoaJuridica/planoacao/:idPlanoAcao

    ///empresas/`${this.idPessoaJuridicaFornecedor}/planoacao/${idPlanoAcao}`

    this.router.navigate([`/empresas/${this.idPessoaJuridicaFornecedor}/planoacao/${idPlanoAcao}`]);
  }
}
