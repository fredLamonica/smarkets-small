/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SdkInputIconComponent } from './sdk-input-icon.component';

describe('SdkInputIconComponent', () => {
  let component: SdkInputIconComponent;
  let fixture: ComponentFixture<SdkInputIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkInputIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkInputIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
