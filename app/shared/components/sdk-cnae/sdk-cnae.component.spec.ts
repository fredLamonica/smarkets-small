import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkCnaeComponent } from './sdk-cnae.component';

describe('SdkCnaeComponent', () => {
  let component: SdkCnaeComponent;
  let fixture: ComponentFixture<SdkCnaeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkCnaeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkCnaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
