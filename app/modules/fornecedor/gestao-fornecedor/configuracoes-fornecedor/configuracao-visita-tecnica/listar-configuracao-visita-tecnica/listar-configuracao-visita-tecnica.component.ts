import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TranslationLibraryService, AutenticacaoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracaoVisitaTecnicaService } from '@shared/providers/configuracao-visita-tecnica.service';
import { ConfiguracaoVisitaTecnica } from '@shared/models/configuracao-visita-tecnica';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao, AuditoriaComponent } from '@shared/components';
import { ManterConfiguracaoVisitaTecnicaComponent } from '../manter-configuracao-visita-tecnica/manter-configuracao-visita-tecnica.component';
import { ImpactoQuestao } from '@shared/models';

@Component({
  selector: 'app-listar-configuracao-visita-tecnica',
  templateUrl: './listar-configuracao-visita-tecnica.component.html',
  styleUrls: ['./listar-configuracao-visita-tecnica.component.scss']
})
export class ListarConfiguracaoVisitaTecnicaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public todasConfiguracoesVisitasTecnicas: Array<ConfiguracaoVisitaTecnica>;
  public configuracoesVisitasTecnicasFiltradas: Array<ConfiguracaoVisitaTecnica>;
  public termo: string = '';
  public ImpactoQuestao = ImpactoQuestao;

  constructor(
    private configuracaoVisitaTecnicaService: ConfiguracaoVisitaTecnicaService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.carregarListas().then(
      x => (this.configuracoesVisitasTecnicasFiltradas = this.todasConfiguracoesVisitasTecnicas)
    );
  }

  private async carregarListas() {
    try {
      this.todasConfiguracoesVisitasTecnicas = await this.obterConfiguracoesVisitasTecnicasTenant();
      if (this.todasConfiguracoesVisitasTecnicas == null) {
        this.todasConfiguracoesVisitasTecnicas = {} as ConfiguracaoVisitaTecnica[];
      }
    } catch {
      this.translationLibrary.translations.ALERTS.this.toastr.error(
        this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async obterConfiguracoesVisitasTecnicasTenant(): Promise<
    Array<ConfiguracaoVisitaTecnica>
  > {
    return this.configuracaoVisitaTecnicaService.obter().toPromise();
  }

  public incluirQuestao() {
    const modalRef = this.modalService.open(ManterConfiguracaoVisitaTecnicaComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.result.then(result => {
      if (result) {
        this.todasConfiguracoesVisitasTecnicas.push(result);
        this.filtrar();
      }
    });
  }

  public solicitarExclusao(configuracaoVisitaTecnica: ConfiguracaoVisitaTecnica) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.deletar(configuracaoVisitaTecnica.idConfiguracaoVisitaTecnica),
        reason => {}
      );
  }

  public deletar(id: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.configuracaoVisitaTecnicaService.deletar(id).subscribe(
      response => {
        this.tratarDelecao(id);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private tratarDelecao(id: number) {
    this.configuracoesVisitasTecnicasFiltradas = this.configuracoesVisitasTecnicasFiltradas.filter(
      c => c.idConfiguracaoVisitaTecnica != id
    );
    this.todasConfiguracoesVisitasTecnicas = this.todasConfiguracoesVisitasTecnicas.filter(
      c => c.idConfiguracaoVisitaTecnica != id
    );
  }

  public editar(configuracaoVisitaTecnica: ConfiguracaoVisitaTecnica) {
    const modalRef = this.modalService.open(ManterConfiguracaoVisitaTecnicaComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.form.patchValue(configuracaoVisitaTecnica);

    modalRef.result.then(result => {
      if (result) {
        const index = this.todasConfiguracoesVisitasTecnicas.findIndex(
          obj => obj.idConfiguracaoVisitaTecnica == result.idConfiguracaoVisitaTecnica
        );
        this.todasConfiguracoesVisitasTecnicas.splice(index, 1, result);
        this.filtrar();
      }
    });
  }

  public onAuditoriaClick(IdConfiguracaoVisitaTecnica: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'ConfiguracaoVisitaTecnica';
    modalRef.componentInstance.idEntidade = IdConfiguracaoVisitaTecnica;
  }

  public buscar(termo) {
    this.termo = termo;
    this.filtrar();
  }

  public filtrar() {
    this.configuracoesVisitasTecnicasFiltradas = this.todasConfiguracoesVisitasTecnicas.filter(
      x => x.questao.trim().toLowerCase().indexOf(this.termo.trim().toLowerCase()) !== -1
    );
  }

  public limparFiltro() {
    this.termo = '';
    this.filtrar();
  }

  public isNullOrWhitespace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch {}
    return a || b;
  }
}
