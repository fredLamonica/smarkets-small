import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterNaturezaJuridicaComponent } from './manter-natureza-juridica.component';

describe('ManterNaturezasJuridicasComponent', () => {
  let component: ManterNaturezaJuridicaComponent;
  let fixture: ComponentFixture<ManterNaturezaJuridicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterNaturezaJuridicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterNaturezaJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
