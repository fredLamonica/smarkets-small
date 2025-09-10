import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CotacaoRodadaService, CotacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { RequisicaoService } from '../../../../shared/providers/requisicao.service';

@Component({
  selector: 'app-manter-requisicao-item',
  templateUrl: './manter-requisicao-item.component.html',
  styleUrls: ['./manter-requisicao-item.component.scss']
})
export class ManterRequisicaoItemComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    public activeModal: NgbActiveModal,
    private translationLibrary: TranslationLibraryService,
    private RequisicaoService: RequisicaoService,
    private cotacaoService: CotacaoService,
    private cotacaoRodadaService: CotacaoRodadaService
  ) { }

  ngOnInit() {
  }

  public cancelar() {
    this.activeModal.close();
  }

  public aprovarRequisicaoItem() {

  }

  public finalizarRequisicaoitem() {
    // Chama encerrarCotacao() do mapa-comparativo-por-item
  }



}
