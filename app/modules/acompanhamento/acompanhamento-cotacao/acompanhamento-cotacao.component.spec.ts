import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcompanhamentoCotacaoComponent } from './acompanhamento-cotacao.component';

describe('AcompanhamentoCotacaoComponent', () => {
  let component: AcompanhamentoCotacaoComponent;
  let fixture: ComponentFixture<AcompanhamentoCotacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcompanhamentoCotacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcompanhamentoCotacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
