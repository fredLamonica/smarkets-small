import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TipoOperacaoTrack } from '../../../../shared/models/enums/Track/tipo-operacao-track';
import { TranslationLibraryService } from '../../../../shared/providers';
import { PedidoTrackService } from '../../../../shared/providers/track/pedido-track.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { EmailUsuarioBaseComponent } from '../email-usuario-base/email-usuario-base.component';

@Component({
  selector: 'smk-email-usuario-parada-manutencao',
  templateUrl: '../email-usuario-base/email-usuario-base.component.html',
  styleUrls: ['../email-usuario-base/email-usuario-base.component.scss']
})
export class EmailUsuarioParadaManutencaoComponent extends EmailUsuarioBaseComponent implements OnInit{

  tipoOperacao = TipoOperacaoTrack.paradaManutencao;
  descricaoFuncionalidade = "ParadaManutencao";

  constructor(
    fb: FormBuilder,
    pedidoTrackService: PedidoTrackService,
    errorService: ErrorService,
    translationLibrary: TranslationLibraryService
  ) {
    super(fb, pedidoTrackService, errorService, translationLibrary )
   }

   ngOnInit(): void {
    super.ngOnInit();
  }


}
