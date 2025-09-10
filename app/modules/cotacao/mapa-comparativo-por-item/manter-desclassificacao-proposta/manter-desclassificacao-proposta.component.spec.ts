import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterDesclassificacaoPropostaComponent } from './manter-desclassificacao-proposta.component';

describe('ManterDesclassificacaoPropostaComponent', () => {
  let component: ManterDesclassificacaoPropostaComponent;
  let fixture: ComponentFixture<ManterDesclassificacaoPropostaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterDesclassificacaoPropostaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterDesclassificacaoPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
