import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorGraficoComponent } from './indicador-grafico.component';

describe('IndicadorGraficoComponent', () => {
  let component: IndicadorGraficoComponent;
  let fixture: ComponentFixture<IndicadorGraficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorGraficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
