import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkChipComponent } from './sdk-chip.component';

describe('SdkChipComponent', () => {
  let component: SdkChipComponent;
  let fixture: ComponentFixture<SdkChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
