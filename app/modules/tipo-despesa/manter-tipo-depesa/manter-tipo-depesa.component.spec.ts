import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterTipoDepesaComponent } from './manter-tipo-depesa.component';

describe('ManterTipoDepesaComponent', () => {
  let component: ManterTipoDepesaComponent;
  let fixture: ComponentFixture<ManterTipoDepesaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterTipoDepesaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterTipoDepesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
