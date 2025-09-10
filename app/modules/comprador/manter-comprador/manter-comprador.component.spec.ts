import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCompradorComponent } from './manter-comprador.component';

describe('ManterCompradorComponent', () => {
  let component: ManterCompradorComponent;
  let fixture: ComponentFixture<ManterCompradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCompradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCompradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
