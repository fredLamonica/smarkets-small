import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularItemParticipanteContratoComponent } from './vincular-item-participante-contrato.component';

describe('VincularItemParticipanteContratoComponent', () => {
  let component: VincularItemParticipanteContratoComponent;
  let fixture: ComponentFixture<VincularItemParticipanteContratoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularItemParticipanteContratoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularItemParticipanteContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
