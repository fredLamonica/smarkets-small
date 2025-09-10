import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSaveLabelComponent } from './auto-save-label.component';

describe('AutoSaveLabelComponent', () => {
  let component: AutoSaveLabelComponent;
  let fixture: ComponentFixture<AutoSaveLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoSaveLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoSaveLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
