import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcompanhamentoRequisicaoComponent } from './acompanhamento-requisicao.component';

describe('AcompanhamentoRequisicaoComponent', () => {
  let component: AcompanhamentoRequisicaoComponent;
  let fixture: ComponentFixture<AcompanhamentoRequisicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcompanhamentoRequisicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcompanhamentoRequisicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
