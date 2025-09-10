import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCotacaoParticipantesComponent } from './manter-cotacao-participantes.component';

describe('ManterCotacaoParticipantesComponent', () => {
  let component: ManterCotacaoParticipantesComponent;
  let fixture: ComponentFixture<ManterCotacaoParticipantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCotacaoParticipantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCotacaoParticipantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
