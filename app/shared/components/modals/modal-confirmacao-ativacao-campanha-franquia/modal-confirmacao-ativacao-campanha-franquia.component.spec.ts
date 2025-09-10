import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmacaoAtivacaoCampanhaFranquiaComponent } from './modal-confirmacao-ativacao-campanha-franquia.component';

describe('ModalConfirmacaoAtivacaoCampanhaFranquiaComponent', () => {
  let component: ModalConfirmacaoAtivacaoCampanhaFranquiaComponent;
  let fixture: ComponentFixture<ModalConfirmacaoAtivacaoCampanhaFranquiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmacaoAtivacaoCampanhaFranquiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmacaoAtivacaoCampanhaFranquiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
