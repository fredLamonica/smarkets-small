import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { PedidoItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {

  constructor() { }

  getObservable<T>(value: T): Observable<T> {
    return new Observable((observer) => {
      observer.next(value);
      observer.complete();
    });
  }

  getHttpParams(params: Map<string, any>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      params.forEach((value: any, key: string) => {
        httpParams = httpParams.set(key, value.toString());
      });
    }

    return httpParams;
  }

  getHttpParamsFromObject(data: any): HttpParams {
    return new HttpParams({ fromObject: data });
  }

  getNumberWithoutFormat(numberInput: string): number {
    if (numberInput) {
      if (typeof numberInput === 'string') {
        let numberOutput: string = numberInput.replace(/\./g, '');
        numberOutput = numberOutput.replace(',', '.');

        return +numberOutput;
      }

      return +numberInput;
    }

    return 0;
  }

  markControlAsDirty(control: AbstractControl): void {
    if (control instanceof FormGroup) {
      const controls = control.controls;

      Object.keys(controls).forEach((key) => {
        this.markControlAsDirty(controls[key]);
      });
    } else if (control instanceof FormArray) {
      control.controls.forEach((formControl) => this.markControlAsDirty(formControl));
    } else if (control instanceof FormControl) {
      control.markAsDirty();
    }
  }

  obtenhaDataDeEntrega(pedidoItem: PedidoItem): string {

    if (pedidoItem.entregaProgramada) {
      if (pedidoItem.entregaProgramadaUltimaDataDto) {
        return pedidoItem.entregaProgramadaUltimaDataDto.ultimaDataEntregaDias;
      }
    } else {
      if (pedidoItem.dataEntrega) {
        return moment(pedidoItem.dataEntrega).format('DD/MM/YYYY');
      }
    }

    return '--';
  }

}
