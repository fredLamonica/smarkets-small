import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkThreeColumnsComponent } from './sdk-three-columns.component';

describe('SdkThreeColumnsComponent', () => {
  let component: SdkThreeColumnsComponent;
  let fixture: ComponentFixture<SdkThreeColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkThreeColumnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkThreeColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
