import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCotacaoPropostaComponent } from './manter-cotacao-proposta.component';

describe('ManterCotacaoPropostaComponent', () => {
  let component: ManterCotacaoPropostaComponent;
  let fixture: ComponentFixture<ManterCotacaoPropostaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCotacaoPropostaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCotacaoPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
