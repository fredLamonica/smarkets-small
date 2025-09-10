import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoAprovacaoComponent } from './historico-aprovacao.component';

describe('HistoricoAprovacaoComponent', () => {
  let component: HistoricoAprovacaoComponent;
  let fixture: ComponentFixture<HistoricoAprovacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoAprovacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoAprovacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
