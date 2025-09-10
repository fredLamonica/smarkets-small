import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FuncionalidadeConfiguracaoUsuario } from '../../../shared/models/enums/funcionalidade-configuracao-usuario.enum';
import { TipoOperacaoTrack } from '../../../shared/models/enums/Track/tipo-operacao-track';
import { ArquivoService, AutenticacaoService, TranslationLibraryService } from '../../../shared/providers';
import { ImportacaoModeloService } from '../../../shared/providers/importacao-modelo.service';
import { ImportacaoTrackService } from '../../../shared/providers/track/importacao-track-service';
import { PedidoTrackService } from '../../../shared/providers/track/pedido-track.service';
import { ErrorService } from '../../../shared/utils/error.service';
import { TrackBaseComponent } from '../track-base/track-base.component';

@Component({
  selector: 'smk-parada-manutencao',
  templateUrl: './../track-base/track-base.component.html',
  styleUrls: ['./../track-base/track-base.component.scss']
})
export class ParadaManutencaoComponent extends TrackBaseComponent implements OnInit{
  tipoOperacao = TipoOperacaoTrack.paradaManutencao;
  funcionalidade = FuncionalidadeConfiguracaoUsuario.ParadaManutencao;
  descricaoFuncionalidade = 'Parada Manutencao';

  constructor(
     toastr: ToastrService,
     fb: FormBuilder,
     translationLibrary: TranslationLibraryService,
     importacaoService: ImportacaoTrackService,
     errorService: ErrorService,
     arquivoService: ArquivoService,
     route: ActivatedRoute,
     router: Router,
     modalService: NgbModal,
     pedidoTrackService: PedidoTrackService,
     autenticacaoService: AutenticacaoService,
     importacaoModeloService: ImportacaoModeloService
  ) {
    super(
      toastr,
      fb,
      translationLibrary,
      importacaoService,
      errorService,
      arquivoService,
      route,
      router,
      modalService,
      pedidoTrackService,
      autenticacaoService,
      importacaoModeloService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
