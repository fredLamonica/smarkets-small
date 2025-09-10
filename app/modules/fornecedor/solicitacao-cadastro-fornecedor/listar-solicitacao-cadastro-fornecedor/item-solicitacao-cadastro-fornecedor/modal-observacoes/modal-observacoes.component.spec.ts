import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalObservacoesComponent } from './modal-observacoes.component';

describe('ModalObservacoesComponent', () => {
  let component: ModalObservacoesComponent;
  let fixture: ComponentFixture<ModalObservacoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalObservacoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalObservacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
