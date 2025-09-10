import { Cnae } from './../../../models/cnae';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AutenticacaoService, CnaeService, TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'item-cnae',
  templateUrl: './item-cnae.component.html',
  styleUrls: ['./item-cnae.component.scss']
})
export class ItemCnaeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() cnae: Cnae;
  @Output() atualizarCnae: EventEmitter<any> = new EventEmitter();

  constructor(
    private authService: AutenticacaoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cnaeService: CnaeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  public excluirCnae(cnae: Cnae) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cnaeService.deletarCnae(cnae.idCnae).subscribe(
      response => {
        if (response) {
          this.eventEmitter();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private eventEmitter() {
    this.atualizarCnae.emit(this.cnae);
  }
}
