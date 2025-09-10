import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterMotivoDesclassificacaoComponent } from './manter-motivo-desclassificacao.component';

describe('ManterMotivoDesclassificacaoComponent', () => {
  let component: ManterMotivoDesclassificacaoComponent;
  let fixture: ComponentFixture<ManterMotivoDesclassificacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterMotivoDesclassificacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterMotivoDesclassificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
