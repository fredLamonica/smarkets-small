import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceiteTermosComponent } from './aceite-termos.component';

describe('AceiteTermosComponent', () => {
  let component: AceiteTermosComponent;
  let fixture: ComponentFixture<AceiteTermosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceiteTermosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceiteTermosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
