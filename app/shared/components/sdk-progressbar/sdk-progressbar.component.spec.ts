import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkProgressbarComponent } from './sdk-progressbar.component';

describe('SdkProgressbarComponent', () => {
  let component: SdkProgressbarComponent;
  let fixture: ComponentFixture<SdkProgressbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkProgressbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
