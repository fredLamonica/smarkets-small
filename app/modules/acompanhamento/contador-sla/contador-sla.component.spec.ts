import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContadorSlaComponent } from './contador-sla.component';

describe('ContadorSlaComponent', () => {
  let component: ContadorSlaComponent;
  let fixture: ComponentFixture<ContadorSlaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContadorSlaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContadorSlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
