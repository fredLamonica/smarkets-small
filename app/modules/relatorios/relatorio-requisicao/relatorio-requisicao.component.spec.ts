import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioRequisicaoComponent } from './relatorio-requisicao.component';

describe('RelatorioRequisicaoComponent', () => {
  let component: RelatorioRequisicaoComponent;
  let fixture: ComponentFixture<RelatorioRequisicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioRequisicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioRequisicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
