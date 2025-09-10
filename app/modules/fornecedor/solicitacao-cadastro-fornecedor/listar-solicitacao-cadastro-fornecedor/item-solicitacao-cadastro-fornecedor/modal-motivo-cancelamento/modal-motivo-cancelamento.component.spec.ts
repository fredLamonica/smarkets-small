import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMotivoCancelamentoComponent } from './modal-motivo-cancelamento.component';

describe('ModalMotivoCancelamentoComponent', () => {
  let component: ModalMotivoCancelamentoComponent;
  let fixture: ComponentFixture<ModalMotivoCancelamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMotivoCancelamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMotivoCancelamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
