import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarVinculoRequisicaoItemComponent } from './confirmar-vinculo-requisicao-item.component';

describe('ConfirmarVinculoRequisicaoItemComponent', () => {
  let component: ConfirmarVinculoRequisicaoItemComponent;
  let fixture: ComponentFixture<ConfirmarVinculoRequisicaoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarVinculoRequisicaoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarVinculoRequisicaoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
