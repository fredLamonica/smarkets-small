import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterIvaComponent } from './manter-iva.component';

describe('ManterIvaComponent', () => {
  let component: ManterIvaComponent;
  let fixture: ComponentFixture<ManterIvaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterIvaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterIvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
