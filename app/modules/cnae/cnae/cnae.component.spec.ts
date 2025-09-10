import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnaeComponent } from './cnae.component';

describe('CnaeComponent', () => {
  let component: CnaeComponent;
  let fixture: ComponentFixture<CnaeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnaeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
