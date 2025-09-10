import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkChartBarComponent } from './sdk-chart-bar.component';

describe('SdkChartBarComponent', () => {
  let component: SdkChartBarComponent;
  let fixture: ComponentFixture<SdkChartBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkChartBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkChartBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
