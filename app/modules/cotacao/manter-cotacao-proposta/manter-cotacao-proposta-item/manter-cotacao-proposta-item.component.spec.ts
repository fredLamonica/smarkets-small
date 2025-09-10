import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCotacaoPropostaItemComponent } from './manter-cotacao-proposta-item.component';

describe('ManterCotacaoPropostaItemComponent', () => {
  let component: ManterCotacaoPropostaItemComponent;
  let fixture: ComponentFixture<ManterCotacaoPropostaItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCotacaoPropostaItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCotacaoPropostaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
