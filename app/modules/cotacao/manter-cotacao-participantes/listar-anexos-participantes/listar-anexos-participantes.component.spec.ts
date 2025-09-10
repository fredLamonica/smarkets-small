import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAnexosParticipantesComponent } from './listar-anexos-participantes.component';

describe('ListarAnexosParticipantesComponent', () => {
  let component: ListarAnexosParticipantesComponent;
  let fixture: ComponentFixture<ListarAnexosParticipantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarAnexosParticipantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAnexosParticipantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
