import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { ResponseModalModel, ModalSizeEnum } from '@shared/models';


@Injectable()
export class ModalsService {
  constructor(private modalService: NgbModal) { }

  public showModal(
    modalComponent: any,
    modalSize: ModalSizeEnum = ModalSizeEnum.Default,
    params?: any,
    windowClass?: any,
    disabled: boolean = false
  ): Observable<ResponseModalModel> {
    const modal = this.modalService.open(
      modalComponent,
      {
        size: <any>this.getModalSize(modalSize),
        windowClass: windowClass,
        centered: true
      }
    );
    if (params) {
      modal.componentInstance.params = params;
    }
    modal.componentInstance.disabled = disabled;
    modal.componentInstance.onClose = new Subject<any>();
    modal.componentInstance.showModal();

    return modal.componentInstance.onClose;
  }

  private getModalSize(modalSize: ModalSizeEnum): string {
    switch (modalSize) {
      case ModalSizeEnum.Small:
        return 'sm';
      case ModalSizeEnum.Big:
        return 'lg';
      default:
        return 'sm';
    }
  }
}
