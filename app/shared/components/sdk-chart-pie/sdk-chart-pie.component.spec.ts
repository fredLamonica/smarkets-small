import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkChartPieComponent } from './sdk-chart-pie.component';

describe('SdkChartPieComponent', () => {
  let component: SdkChartPieComponent;
  let fixture: ComponentFixture<SdkChartPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkChartPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkChartPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
