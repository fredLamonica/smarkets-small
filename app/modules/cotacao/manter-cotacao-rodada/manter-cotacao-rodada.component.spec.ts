import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCotacaoRodadaComponent } from './manter-cotacao-rodada.component';

describe('ManterCotacaoRodadaComponent', () => {
  let component: ManterCotacaoRodadaComponent;
  let fixture: ComponentFixture<ManterCotacaoRodadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCotacaoRodadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCotacaoRodadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
