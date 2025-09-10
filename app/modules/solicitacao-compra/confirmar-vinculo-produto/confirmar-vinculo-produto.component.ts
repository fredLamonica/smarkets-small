import { Component, OnInit, ViewChild } from '@angular/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { CatalogoItem, TipoCatalogoItem } from '@shared/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoItemGradeComponent } from '@shared/components';

@Component({
  selector: 'app-confirmar-vinculo-produto',
  templateUrl: './confirmar-vinculo-produto.component.html',
  styleUrls: ['./confirmar-vinculo-produto.component.scss']
})
export class ConfirmarVinculoProdutoComponent implements OnInit {

  @ViewChild(CatalogoItemGradeComponent) catalogoItemGrade: CatalogoItemGradeComponent
  @BlockUI() blockUI: NgBlockUI;

  public TipoCatalogoItem = TipoCatalogoItem;

  public item: CatalogoItem;
  public quantidade: number;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  public confirmar() {
    this.activeModal.close({ item: this.item, quantidade: this.catalogoItemGrade.quantidade });
  }

  public fechar() {
    this.activeModal.close();
  }

}
