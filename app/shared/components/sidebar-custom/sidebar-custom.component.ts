import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

//Para utilizar o componente, exemplo:
//public openModal() {
//  const modalRef = this.modalService.open(SidebarCustomComponent, {
//    backdrop: 'static'
//  });
//  modalRef.componentInstance.nameTitle = 'Inserir Item';
//  modalRef.componentInstance.nameButton = 'Salvar';
//}

//Para colocar o sidebar no lodo direito da tela, no topo da tela e sem barra de rolagem, por
//exemplo, deve colocar esse estilo no css de quem vai chamar o componente:
//::ng-deep .modal {
//  left: 900px !important;
//  top: -25px !important;
//  overflow: hidden !important;
//}

//Para deixar o modal sem o border-radius utilizar no css de quem vai chamar o componente:
//::ng-deep .modal-content {
//  -webkit-border-radius: 0px !important;
//  -moz-border-radius: 0px !important;
//  border-radius: 0px !important;
//}

@Component({
  selector: 'app-sidebar-custom',
  templateUrl: './sidebar-custom.component.html',
  styleUrls: ['./sidebar-custom.component.scss']
})
export class SidebarCustomComponent implements OnInit {
  @Input() nameTitle: string;
  @Input() nameButton: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  public closeSideBar() {
    this.activeModal.close(false);
  }
}
