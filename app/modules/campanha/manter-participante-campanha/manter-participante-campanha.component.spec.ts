import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterParticipanteCampanhaComponent } from './manter-participante-campanha.component';

describe('ManterParticipanteCampanhaComponent', () => {
  let component: ManterParticipanteCampanhaComponent;
  let fixture: ComponentFixture<ManterParticipanteCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterParticipanteCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterParticipanteCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
