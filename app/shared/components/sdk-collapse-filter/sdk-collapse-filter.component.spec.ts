import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkCollapseFilterComponent } from './sdk-collapse-filter.component';

describe('SdkCollapseMenuComponent', () => {
  let component: SdkCollapseFilterComponent;
  let fixture: ComponentFixture<SdkCollapseFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SdkCollapseFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkCollapseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
