import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoImportacao } from '../../../../shared/models/enums/Track/tipo-importacao';
import { ArquivoService, TranslationLibraryService } from '../../../../shared/providers';
import { ImportacaoTrackService } from '../../../../shared/providers/track/importacao-track-service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { ImportacaoBaseComponent } from '../importacao/importacao.component';

@Component({
  selector: 'importacao-qm',
  templateUrl: '../importacao/importacao.component.html',
  styleUrls: ['../importacao/importacao.component.scss']
})

export class ImportacaoQmComponent extends ImportacaoBaseComponent {
  tipoImportacao = TipoImportacao.qm;
  descricaoFuncionalidade = "QM";

  constructor(
        fb: FormBuilder,
        importacaoService: ImportacaoTrackService,
        errorService: ErrorService,
        modalService: NgbModal,
        arquivoService: ArquivoService,
        translationLibrary: TranslationLibraryService
      ) {
        super(fb,importacaoService, errorService, modalService, arquivoService, translationLibrary);
      }
}

