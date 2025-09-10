import { Endereco } from './../../../../shared/models/endereco';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EnderecoService, TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-exibir-endereco',
  templateUrl: './exibir-endereco.component.html',
  styleUrls: ['./exibir-endereco.component.scss']
})
export class ExibirEnderecoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public idEnderecoEntrega: number;
  public endereco: Endereco;

  constructor(
    public activeModal: NgbActiveModal,
    private enderecoService: EnderecoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.obterEndereco();
  }

  private obterEndereco(){
    this.blockUI.start();
    this.enderecoService.obterPorId(this.idEnderecoEntrega).subscribe(response => {
      if (response){
        this.endereco = response;
      }
      else{
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.activeModal.close();
      }
      this.blockUI.stop();
    }, error =>{
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
      this.activeModal.close();
    });
  }

}
