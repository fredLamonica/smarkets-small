import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterTransportadoraComponent } from './manter-transportadora.component';

describe('ManterTransportadoraComponent', () => {
  let component: ManterTransportadoraComponent;
  let fixture: ComponentFixture<ManterTransportadoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterTransportadoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterTransportadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
