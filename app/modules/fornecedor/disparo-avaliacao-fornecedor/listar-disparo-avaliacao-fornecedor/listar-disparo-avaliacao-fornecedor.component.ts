import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DisparoAvaliacaoFornecedor, AvaliacaoFornecedor } from '@shared/models';
import { ToastrService } from 'ngx-toastr';
import { TranslationLibraryService, AvaliacaoFornecedorService } from '@shared/providers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ManterDisparoAvaliacaoFornecedorComponent } from '../manter-disparo-avaliacao-fornecedor/manter-disparo-avaliacao-fornecedor.component';
import * as moment from 'moment';

@Component({
  selector: 'app-listar-disparo-avaliacao-fornecedor',
  templateUrl: './listar-disparo-avaliacao-fornecedor.component.html',
  styleUrls: ['./listar-disparo-avaliacao-fornecedor.component.scss']
})
export class ListarDisparoAvaliacaoFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  private paramsSub: Subscription;
  private idAvaliacaoFornecedor: number;
  public disparos: Array<DisparoAvaliacaoFornecedor>;
  private avaliacao: AvaliacaoFornecedor;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private avaliacaoFornecedorService: AvaliacaoFornecedorService
  ) {}

  ngOnInit() {
    this.obterParametros();
    this.obterDisparos();
    this.obterAvaliacao();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.idAvaliacaoFornecedor = +params['idAvaliacaoFornecedor'];
    });
  }

  private async obterDisparos() {
    try {
      this.disparos = await this.avaliacaoFornecedorService
        .obterDisparos(this.idAvaliacaoFornecedor)
        .toPromise();
    } catch (error) {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
  }

  public incluirNovoDisparo() {
    if (this.avaliacao) {
      if (this.validarAvaliacao(this.avaliacao)) {
        const modalRef = this.modalService.open(ManterDisparoAvaliacaoFornecedorComponent, {
          centered: true,
          size: 'lg'
        });

        modalRef.componentInstance.idAvaliacaoFornecedor = this.idAvaliacaoFornecedor;

        modalRef.result.then(result => this.obterDisparos());
      }
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
  }

  public vizualizarDisparo(disparo: DisparoAvaliacaoFornecedor) {
    const modalRef = this.modalService.open(ManterDisparoAvaliacaoFornecedorComponent, {
      centered: true,
      size: 'lg'
    });

    modalRef.componentInstance.readonly = true;
    modalRef.componentInstance.idDisparoAvaliacaoFornecedor = disparo.idDisparoAvaliacaoFornecedor;
    modalRef.componentInstance.fornecedores = disparo.fornecedores;
    modalRef.componentInstance.usuarios = disparo.usuarios;

    modalRef.result.then(result => this.obterDisparos());
  }

  private validarAvaliacao(avaliacao: AvaliacaoFornecedor) {
    const dataInicio = moment(avaliacao.dataInicio).toDate();
    const dataHoraAtual = moment().toObject();
    const hoje = new Date(dataHoraAtual.years, dataHoraAtual.months, dataHoraAtual.date);

    if (dataInicio < hoje) {
      this.toastr.warning(
        'Não é possível disparar uma avaliação com a data de início anterior à data de hoje'
      );
      return false;
    }

    if (this.avaliacao.questoes == null || this.avaliacao.questoes.length == 0) {
      this.toastr.warning('Não é possível disparar uma avaliação sem questões');
      return false;
    }

    return true;
  }

  private obterAvaliacao() {
    this.avaliacaoFornecedorService.obterPorId(this.idAvaliacaoFornecedor).subscribe(
      response => {
        this.avaliacao = response;
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }
}
