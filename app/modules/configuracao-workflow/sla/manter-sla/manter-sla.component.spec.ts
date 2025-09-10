import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterSlaComponent } from './manter-sla.component';

describe('ManterSlaComponent', () => {
  let component: ManterSlaComponent;
  let fixture: ComponentFixture<ManterSlaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterSlaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterSlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
