import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkChartAreaComponent } from './sdk-chart-area.component';

describe('SdkChartAreaComponent', () => {
  let component: SdkChartAreaComponent;
  let fixture: ComponentFixture<SdkChartAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkChartAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkChartAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
