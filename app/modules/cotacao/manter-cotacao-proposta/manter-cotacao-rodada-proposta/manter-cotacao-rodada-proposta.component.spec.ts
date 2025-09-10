import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCotacaoRodadaPropostaComponent } from './manter-cotacao-rodada-proposta.component';

describe('ManterCotacaoPropostaRodadaComponent', () => {
  let component: ManterCotacaoRodadaPropostaComponent;
  let fixture: ComponentFixture<ManterCotacaoRodadaPropostaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCotacaoRodadaPropostaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCotacaoRodadaPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
