import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { from } from 'rxjs';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CustomTableComponent, InputNumberComponent, PagerComponent } from '..';
import { EntregaProgramada } from '../../models/entrega-programada';
import { OrigemProgramacaoDeEntrega } from '../../models/enums/origem-programacao-de-entrega.enum';
import { CnpjCpfPipe, SituacaoPedidoPipe } from '../../pipes';
import { RequisicaoEntregasProgramadasService } from '../../providers/requisicao-entregas-programadas.service';
import { globalImports } from '../../tests/global-imports';
import { globalProviders } from '../../tests/global-providers';
import { UtilitiesService } from '../../utils/utilities.service';
import { ManterEntregasProgramadasComponent } from './manter-entregas-programadas.component';

describe('ManterEntregasProgramadasComponent', () => {
  const getElementSelector: (controlName: string, prefix?: string, suffix?: string) => string = (controlName, prefix = '', suffix = '') => `${prefix}[formControlName='${controlName}']${suffix}`;

  let component: ManterEntregasProgramadasComponent;
  let fixture: ComponentFixture<ManterEntregasProgramadasComponent>;
  let debugElement: DebugElement;
  let utilitiesService: any;
  let getNumberWithoutFormatSpy: any;
  let requisicaoEntregasProgramadasService: any;
  let getRequisicaoSpy: any;
  // let postRequisicaoSpy: any;

  const maskValor = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 4,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 9,
  });

  beforeEach(async(() => {
    const entregasProgramadas = new Array<EntregaProgramada>(
      new EntregaProgramada({ dataEntrega: '2022-06-12', valor: 10.5, quantidade: 5 }),
      new EntregaProgramada({ dataEntrega: '2022-06-13', valor: 1.5, quantidade: 2 }),
    );

    utilitiesService = jasmine.createSpyObj('UtilitiesService', ['getNumberWithoutFormat']);
    getNumberWithoutFormatSpy = utilitiesService.getNumberWithoutFormat.and.returnValue(1.5);

    requisicaoEntregasProgramadasService = jasmine.createSpyObj('RequisicaoEntregasProgramadasService', ['get', 'post']);
    getRequisicaoSpy = requisicaoEntregasProgramadasService.get.and.returnValue(from([entregasProgramadas]));
    // postRequisicaoSpy = requisicaoEntregasProgramadasService.post.and.stub();

    TestBed.configureTestingModule({
      declarations: [
        ManterEntregasProgramadasComponent,
        InputNumberComponent,
        CustomTableComponent,
        PagerComponent,
        SituacaoPedidoPipe,
        CnpjCpfPipe,
      ],
      providers: [
        ...globalProviders,
        { provide: UtilitiesService, useValue: utilitiesService },
        { provide: RequisicaoEntregasProgramadasService, useValue: requisicaoEntregasProgramadasService },
      ],
      imports: [...globalImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterEntregasProgramadasComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    component.valorMascara = { mask: maskValor, guide: false };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`default collapsed mode should be 'false'`, () => {
    expect(component.modoCollapsed).toBeFalsy();
  });

  it(`collapsed mode should be toggle`, () => {
    component.toggleCollapse();
    expect(component.modoCollapsed).toBeTruthy();
  });

  it(`origin 'pedido' don't has a value field`, () => {
    component.origem = OrigemProgramacaoDeEntrega.pedido;
    fixture.detectChanges();
    const elValorDe = debugElement.query(By.css(getElementSelector('valor', `[type='text']`)));
    expect(elValorDe).toBeNull();
  });

  it(`origin 'requisicao' has a value field`, () => {
    component.origem = OrigemProgramacaoDeEntrega.requisicao;
    fixture.detectChanges();
    const elValorDe = debugElement.query(By.css(getElementSelector('valor', `[type='text']`)));
    expect(elValorDe).not.toBeNull();
  });

  // it(`inclusion flow expects`, () => {
  //   component.origem = OrigemProgramacaoDeEntrega.requisicao;
  //   fixture.detectChanges();

  //   const elDataEntregaDe = debugElement.query(By.css(getElementSelector('dataEntrega')));
  //   const elDataEntrega: HTMLInputElement = elDataEntregaDe.nativeElement;

  //   elDataEntrega.value = '2022-06-14';
  //   elDataEntrega.dispatchEvent(new Event('input'));

  //   const elValorDe = debugElement.query(By.css(getElementSelector('valor')));
  //   const elValor: HTMLInputElement = elValorDe.nativeElement;

  //   elValor.value = '2,5';
  //   elValor.dispatchEvent(new Event('input'));

  //   const elQuantidadeDe = debugElement.query(By.css(getElementSelector('quantidade', '', ' input')));
  //   const elQuantidade: HTMLInputElement = elQuantidadeDe.nativeElement;

  //   // component.form.controls.quantidade.setValue('2');

  //   elQuantidade.value = '2';
  //   elQuantidade.dispatchEvent(new Event('input'));

  //   // fixture.detectChanges();

  //   // component.inclua();

  //   expect(getNumberWithoutFormatSpy.calls.count()).toBe(1, 'UtilitiesService.getNumberWithoutFormat called');
  //   expect(component.form.controls.quantidade.value).toBe(2, 'Value seted');
  //   expect(postRequisicaoSpy.calls.count()).toBe(1, 'RequisicaoEntregasProgramadasService.post called');

  // });

});
