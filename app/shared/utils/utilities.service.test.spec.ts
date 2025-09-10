import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PedidoItem } from '../models';
import { EntregaProgramadaUltimaData } from '../models/entrega-programada-ultima-data';
import { UtilitiesService } from './utilities.service';

describe('UtilitiesService', () => {
  let service: UtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.get(UtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`'getObservable' should be work`, () => {
    const value = 123;
    const observable = service.getObservable(value);

    expect(observable).not.toBeNull(`return should be not null`);
    expect(observable instanceof Observable).toBeTruthy(`return should be an 'Observable'`);

    observable.subscribe((valueByObservable) => {
      expect(valueByObservable).toBe(value, `value of 'Observable' should be '${value}'`);
    });
  });

  it(`'getHttpParams' should be work`, () => {
    const param1Name = 'param1';
    const param1Value = 123;
    const params = new Map<string, any>().set(param1Name, param1Value);
    const httpParams = service.getHttpParams(params);

    expect(httpParams).not.toBeNull(`return should be not null`);
    expect(httpParams instanceof HttpParams).toBeTruthy(`return should be an 'HttpParams'`);
    expect(+httpParams.get(param1Name)).toBe(param1Value, `value of param should be '${param1Value}'`);
  });

  it(`'getHttpParamsFromObject' should be work`, () => {
    const param = { prop1: 'paramValue', prop2: 123 };
    const httpParams = service.getHttpParamsFromObject(param);

    expect(httpParams).not.toBeNull(`return should be not null`);
    expect(httpParams instanceof HttpParams).toBeTruthy(`return should be an 'HttpParams'`);
    expect(httpParams.get('prop1')).toBe(param.prop1, `value of param should be '${param.prop1}'`);
    expect(+httpParams.get('prop2')).toBe(param.prop2, `value of param should be '${param.prop2}'`);
  });

  describe(`'getNumberWithoutFormat' should be work`, () => {
    for (const { valueIn, valueOut } of [
      { valueIn: '0,01', valueOut: 0.01 },
      { valueIn: '10,33', valueOut: 10.33 },
      { valueIn: '', valueOut: 0 },
      { valueIn: null, valueOut: 0 },
      { valueIn: 1.5, valueOut: 1.5 },
    ]) {
      it(`number '${valueIn}' should be '${valueOut}' without mask`, () => {
        const value = service.getNumberWithoutFormat(valueIn as string);
        expect(value).toBe(valueOut);
      });
    }
  });

  describe(`'markControlAsDirty' should be work`, () => {
    for (const { controlType, control } of [
      { controlType: 'FromGroup', control: new FormGroup({ control1: new FormControl(), control2: new FormControl() }) },
      { controlType: 'FormArray', control: new FormArray([new FormControl(), new FormControl()]) },
      { controlType: 'FormControl', control: new FormControl() },
    ]) {
      it(`control type '${controlType}'`, () => {
        expect(control.dirty).toBeFalsy('control not should be dirty');
        service.markControlAsDirty(control);
        expect(control.dirty).toBeTruthy('control should be dirty');
      });
    }
  });

  describe(`'obtenhaDataDeEntrega' should be work`, () => {
    const dataEntrega = '25/01/2022';
    const dataEntregaComEntregaProgramada = `${dataEntrega} (em 2 entregas)`;

    const pedidoItemSemEntregaProgramada = {
      dataEntrega: '2022-01-25',
      entregaProgramada: false,
    } as PedidoItem;

    const pedidoItemComEntregaProgramada = {
      entregaProgramada: true,
      entregaProgramadaUltimaDataDto: new EntregaProgramadaUltimaData({
        ultimaDataEntregaDias: dataEntregaComEntregaProgramada,
      }),
    } as PedidoItem;

    for (const { entregaProgramada, pedidoItem, label } of [
      { entregaProgramada: 'sem', pedidoItem: pedidoItemSemEntregaProgramada, label: dataEntrega },
      { entregaProgramada: 'com', pedidoItem: pedidoItemComEntregaProgramada, label: dataEntregaComEntregaProgramada },
      { entregaProgramada: 'sem', pedidoItem: {} as PedidoItem, label: '--' },
    ]) {
      it(`'PedidoItem' ${entregaProgramada} entrega programada`, () => {
        const dataEntregaLabel = service.obtenhaDataDeEntrega(pedidoItem);
        expect(dataEntregaLabel).toBe(label);
      });
    }
  });
});
