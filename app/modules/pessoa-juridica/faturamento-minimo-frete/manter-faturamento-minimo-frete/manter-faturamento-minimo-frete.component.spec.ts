import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterFaturamentoMinimoFreteComponent } from './manter-faturamento-minimo-frete.component';

describe('ManterFaturamentoMinimoFreteComponent', () => {
  let component: ManterFaturamentoMinimoFreteComponent;
  let fixture: ComponentFixture<ManterFaturamentoMinimoFreteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterFaturamentoMinimoFreteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterFaturamentoMinimoFreteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
