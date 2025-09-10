import { Component, OnInit } from '@angular/core';
import { TranslationLibraryService } from '@shared/providers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Avaliacao } from '@shared/models';

@Component({
  selector: 'app-manter-avaliacao',
  templateUrl: './manter-avaliacao.component.html',
  styleUrls: ['./manter-avaliacao.component.scss']
})
export class ManterAvaliacaoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private translationLibrary: TranslationLibraryService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    
  }

  public cancelar() {
    this.activeModal.close();
  }

  public salvar() { }

}
