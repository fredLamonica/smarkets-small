import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-selecionar-icone-categoria',
  templateUrl: './selecionar-icone-categoria.component.html',
  styleUrls: ['./selecionar-icone-categoria.component.scss']
})
export class SelecionarIconeCategoriaComponent implements OnInit {

  @ViewChild('inputTermo')
  inputTermo: ElementRef;

  public iconeSelecionado: string;
  public termo: string;
  public iconesExibicao: Array<string>;

  public icones: Array<string> = [
    "fas fa-pills", "fas fa-tablets", "fas fa-capsules", "fas fa-syringe", "fas fa-prescription-bottle-alt", "fas fa-stethoscope", "fas fa-hospital-alt", 
    "fas fa-first-aid", "fas fa-building", "fas fa-briefcase", "fas fa-wrench", "fas fa-cogs", "fas fa-screwdriver", "fas fa-archive", 
    "fas fa-coffee", "fas fa-fire-extinguisher", "fas fa-vial", "fas fa-laptop", "fas fa-mobile-alt", "fas fa-headphones", "fas fa-plug", "fas fa-keyboard", 
    "fas fa-power-off", "fas fa-battery-three-quarters", "fas fa-graduation-cap", "fas fa-desktop", "fas fa-paperclip", "fas fa-pencil-ruler", 
    "fas fa-pencil-alt", "fas fa-pen-alt", "fas fa-utensils", "fas fa-tshirt", "fas fa-shoe-prints", "fas fa-box-open", "fas fa-lock-open", 
    "fas fa-truck"
  ];

  // public icones: Array<string> = [
  // 'fa fa-address-book', 'fa fa-address-card', 'fa fa-adjust', 'fa fa-align-center', 'fa fa-align-justify', 'fa fa-align-left', 
  // 'fa fa-align-right', 'fa fa-ambulance', 'fa fa-american-sign-language-interpreting', 'fa fa-anchor', 'fa fa-angle-double-down', 
  // 'fa fa-angle-double-left', 'fa fa-angle-double-right', 'fa fa-angle-double-up', 'fa fa-angle-down', 'fa fa-angle-left', 
  // 'fa fa-angle-right', 'fa fa-angle-up', 'fa fa-archive', 'fa fa-arrow-circle-down', 'fa fa-arrow-circle-left', 
  // 'fa fa-arrow-circle-o-right', 'fa fa-arrow-circle-right', 'fa fa-arrow-circle-up', 'fa fa-arrow-down', 'fa fa-arrow-left', 
  // 'fa fa-arrow-right', 'fa fa-arrow-up', 'fa fa-arrows-alt', 'fa fa-asl-interpreting', 'fa fa-assistive-listening-systems', 
  // 'fa fa-asterisk', 'fa fa-at', 'fa fa-audio-description', 'fa fa-backward', 'fa fa-balance-scale', 'fa fa-ban', 'fa fa-barcode', 
  // 'fa fa-bars', 'fa fa-bath', 'fa fa-battery-empty', 'fa fa-battery-full', 'fa fa-battery-half', 'fa fa-battery-quarter', 
  // 'fa fa-battery-three-quarters', 'fa fa-bed', 'fa fa-beer', 'fa fa-bell', 'fa fa-bell-slash', 'fa fa-bicycle', 'fa fa-binoculars', 
  // 'fa fa-birthday-cake', 'fa fa-blind', 'fa fa-bold', 'fa fa-bolt', 'fa fa-bomb', 'fa fa-book', 'fa fa-bookmark', 'fa fa-braille', 
  // 'fa fa-briefcase', 'fa fa-bug', 'fa fa-building', 'fa fa-bullhorn', 'fa fa-bullseye', 'fa fa-bus', 'fa fa-calculator', 
  // 'fa fa-calendar', 'fa fa-camera', 'fa fa-camera-retro', 'fa fa-car', 'fa fa-caret-down', 'fa fa-caret-left', 'fa fa-caret-right', 
  // 'fa fa-caret-up', 'fa fa-cart-arrow-down', 'fa fa-cart-plus', 'fa fa-certificate', 'fa fa-check', 'fa fa-check-circle', 
  // 'fa fa-check-square', 'fa fa-check-square-o', 'fa fa-chevron-circle-down', 'fa fa-chevron-circle-left', 'fa fa-chevron-circle-right', 
  // 'fa fa-chevron-circle-up', 'fa fa-chevron-down', 'fa fa-chevron-left', 'fa fa-chevron-right', 'fa fa-chevron-up', 'fa fa-child', 
  // 'fa fa-circle', 'fa fa-clipboard', 'fa fa-clone', 'fa fa-cloud', 'fa fa-code', 'fa fa-coffee', 'fa fa-cog', 'fa fa-cogs', 'fa fa-columns', 
  // 'fa fa-comment'
  // ];

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.termo = '';
    this.iconesExibicao = this.icones;
  }

  public buscarIcones(termo?: string) {
    if (termo == null)
      this.iconesExibicao = this.icones;
    else
      this.iconesExibicao = this.icones.filter(icone => icone.includes(termo.toLocaleLowerCase(), 0));
  }

  public selecionarIcone(icone: string) {
    this.activeModal.close(icone);
  }

  public fechar() {
    this.activeModal.close();
  }

  public campoBuscaChanged() {
    if (this.inputTermo.nativeElement.value.length == 0) {
      this.iconesExibicao = this.icones;
    }
  }



}
