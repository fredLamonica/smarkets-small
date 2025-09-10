import { Component, OnInit } from '@angular/core';
import { StatusPlanoAcaoFornecedor, PlanoAcaoFornecedor } from '@shared/models';
import { PlanoAcaoFornecedorService, TranslationLibraryService } from '@shared/providers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManterPlanoAcaoFornecedorComponent } from '../manter-plano-acao-fornecedor/manter-plano-acao-fornecedor.component';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-listar-plano-acao-fornecedor',
  templateUrl: './listar-plano-acao-fornecedor.component.html',
  styleUrls: ['./listar-plano-acao-fornecedor.component.scss']
})
export class ListarPlanoAcaoFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public statusPlanoAcaoFornecedor: any[];
  public enumStatusPlanoAcaoFornecedor = StatusPlanoAcaoFornecedor;
  public planosAcao = new Array<PlanoAcaoFornecedor>();
  public buscaAvancada: boolean = false;
  public form: FormGroup;
  public termo = '';

  constructor(
    private planoAcaoFornecedorService: PlanoAcaoFornecedorService,
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.construirFormularioBusca();
    this.obterPlanosAcoes();
    this.statusPlanoAcaoFornecedor = Object.keys(this.enumStatusPlanoAcaoFornecedor).filter(Number);
  }
  public construirFormularioBusca() {
    this.form = this.fb.group({
      termoFornecedor: [''],
      termoPlanodeAcao: [''],
      termoStatus: [''],
      termoPrazo: ['']
    });
  }

  public exibirBuscaAvancada(event: boolean) {
    this.buscaAvancada = event;
  }

  public buscarFiltroAvancado(onScroll: boolean = false) {
    var parametrosFiltroAvancado = [];
    parametrosFiltroAvancado.push(
      this.form.value.termoFornecedor ? this.form.value.termoFornecedor : ''
    );
    parametrosFiltroAvancado.push(
      this.form.value.termoPlanodeAcao ? this.form.value.termoPlanodeAcao : ''
    );
    parametrosFiltroAvancado.push(this.form.value.termoStatus ? this.form.value.termoStatus : '');
    parametrosFiltroAvancado.push(this.form.value.termoPrazo ? this.form.value.termoPrazo : '');
    var parametrosFiltroAvancadoSemNull = [];
    parametrosFiltroAvancado.forEach(param => {
      if (param === 'null') parametrosFiltroAvancadoSemNull.push('');
      else parametrosFiltroAvancadoSemNull.push(param);
    });

    this.obterFiltroAvancado(parametrosFiltroAvancadoSemNull);
  }

  public obterFiltroAvancado(parametrosFiltroAvancado: any[]) {
    var termoFornecedor = parametrosFiltroAvancado[0];
    var termoPlanodeAcao = parametrosFiltroAvancado[1];
    var termoPrazo = parametrosFiltroAvancado[2];
    var termoStatus = parametrosFiltroAvancado[3];
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.planoAcaoFornecedorService
      .obterFiltroAvancado(termoFornecedor, termoPlanodeAcao, termoPrazo, termoStatus)
      .subscribe(
        response => {
          if (response) {
            this.planosAcao = response;
          } else {
            this.planosAcao = new Array<PlanoAcaoFornecedor>();
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public buscar(termo: string) {
    this.termo = termo;
    this.obterPlanosAcoes();
  }

  public obterPlanosAcoes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.planoAcaoFornecedorService.obterFiltro(this.termo).subscribe(
      response => {
        if (response) {
          this.planosAcao = response;
        } else {
          this.planosAcao = new Array<PlanoAcaoFornecedor>();
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public acompanharPlanoAcao(planoAcao) {
    const modalRef = this.modalService.open(ManterPlanoAcaoFornecedorComponent, {
      centered: true,
      size: 'lg'
    });

    if (planoAcao != null) {
      modalRef.componentInstance.planoAcaoFornecedor = planoAcao;
    }

    modalRef.result.then(result => {
      this.obterPlanosAcoes();
    });
  }
}
