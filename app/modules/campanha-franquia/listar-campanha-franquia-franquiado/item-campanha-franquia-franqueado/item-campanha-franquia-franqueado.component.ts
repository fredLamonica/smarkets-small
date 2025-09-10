import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SituacaoCampanha } from '@shared/models';
import { ParticipanteCampanhaFranquia } from '@shared/models/participante-campanha-franquia';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
@Component({
  selector: 'item-campanha-franquia-franqueado',
  templateUrl: './item-campanha-franquia-franqueado.component.html',
  styleUrls: ['./item-campanha-franquia-franqueado.component.scss']
})
export class ItemCampanhaFranquiaFranqueadoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() franchiseCampaign: ParticipanteCampanhaFranquia;
  @Output() itemChange: EventEmitter<any> = new EventEmitter();

  public SituacaoCampanha = SituacaoCampanha;

  constructor( private router: Router ) {}

  ngOnInit() {}

  public cardClicked() {
     let routerString = `${this.franchiseCampaign.idParticipantesCampanhaFranquia}`;
     this.navigateFor(routerString);
  }

  public navigateFor(page: string) {
    this.router.navigate([`${this.router.url}/${page}`]);
  }

  getClass(){
    switch(this.franchiseCampaign.status){
      case "Aprovado":
        return 'status-active';
      case "Reprovado":
        return 'status-inactive';
      case "Aguardando Aceite":
        return 'status-in-configuration';
      case "Encerrado":
        return 'status-terminated';
    }
  }

}
