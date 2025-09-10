import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterParticipanteContratoComponent } from './manter-participante-contrato.component';

describe('ManterParticipanteContratoComponent', () => {
  let component: ManterParticipanteContratoComponent;
  let fixture: ComponentFixture<ManterParticipanteContratoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterParticipanteContratoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterParticipanteContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
