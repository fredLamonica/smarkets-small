import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorNumericoComponent } from './indicador-numerico.component';

describe('IndicadorNumericoComponent', () => {
  let component: IndicadorNumericoComponent;
  let fixture: ComponentFixture<IndicadorNumericoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorNumericoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorNumericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
