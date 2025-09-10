import { Component, OnInit, Input } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Cnae } from '@shared/models';
import { CnaeService, TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'manter-pessoa-cnae',
  templateUrl: './manter-pessoa-cnae.component.html',
  styleUrls: ['./manter-pessoa-cnae.component.scss']
})
export class ManterPessoaCnaeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input('id-pessoa') idPessoa: number;
  @Input() idPessoaJuririca: number;

  public cnaes: Array<Cnae>;
  public cnaesSelecionados: Array<Cnae>;
  public selecionado: Cnae;

  constructor(
    private cnaeService: CnaeService,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService
  ) {}

  ngOnInit() {
    this.carregarListas();
  }

  private async carregarListas() {
    try {
      this.cnaes = await this.obterCnaes();

      if (this.idPessoaJuririca)
        this.cnaesSelecionados = await this.obterCnaesPessoa(this.idPessoaJuririca);
      else this.cnaesSelecionados = new Array<Cnae>();

      this.cnaes = this.cnaes.filter(
        c =>
          !this.cnaesSelecionados
            .map(i => {
              return i.idCnae;
            })
            .includes(c.idCnae)
      );
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
  }

  private async obterCnaes(): Promise<Array<Cnae>> {
    return this.cnaeService.listar().toPromise();
  }

  private async obterCnaesPessoa(idPessoaJuririca: Number): Promise<Array<Cnae>> {
    return this.cnaeService.obterCnaesPessoa(idPessoaJuririca).toPromise();
  }

  // #region Manipulação
  public adicionar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cnaeService.inserirCnaePessoa(this.selecionado.idCnae, this.idPessoa).subscribe(
      response => {
        this.tratarInclusao(this.selecionado);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private tratarInclusao(cnae: Cnae) {
    this.cnaesSelecionados.push(cnae);
    this.selecionado = null;
    this.cnaes = this.cnaes.filter(c => c.idCnae != cnae.idCnae);
  }

  public deletar(cnae: Cnae) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cnaeService.deletarCnae(cnae.idCnae).subscribe(
      response => {
        this.tratarDelecao(cnae);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private tratarDelecao(cnae: Cnae) {
    this.cnaesSelecionados = this.cnaesSelecionados.filter(c => c.idCnae != cnae.idCnae);
    this.cnaes.push(cnae);
  }
  // #endregion
}
