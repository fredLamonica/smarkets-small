import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorPendenciaStatusComponent } from './indicador-pendencia-status.component';

describe('IndicadorPendenciaStatusComponent', () => {
  let component: IndicadorPendenciaStatusComponent;
  let fixture: ComponentFixture<IndicadorPendenciaStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorPendenciaStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorPendenciaStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
