import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterParticipanteItensContratoComponent } from './manter-participante-itens-contrato.component';

describe('ManterParticipanteItensContratoComponent', () => {
  let component: ManterParticipanteItensContratoComponent;
  let fixture: ComponentFixture<ManterParticipanteItensContratoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterParticipanteItensContratoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterParticipanteItensContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
