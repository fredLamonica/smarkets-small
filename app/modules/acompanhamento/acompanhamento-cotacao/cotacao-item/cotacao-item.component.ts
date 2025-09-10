import { Component, OnInit, Input } from '@angular/core';
import { SituacaoCotacaoItem, CotacaoItem } from '@shared/models';

@Component({
  selector: 'cotacao-item',
  templateUrl: './cotacao-item.component.html',
  styleUrls: ['./cotacao-item.component.scss']
})
export class CotacaoItemComponent implements OnInit {
  @Input('item') item: CotacaoItem;

  public SituacaoCotacaoItem = SituacaoCotacaoItem;

  constructor() {}

  ngOnInit() {}
}
