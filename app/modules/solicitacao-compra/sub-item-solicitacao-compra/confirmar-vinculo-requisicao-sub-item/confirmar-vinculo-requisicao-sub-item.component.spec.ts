import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarVinculoRequisicaoSubItemComponent } from './confirmar-vinculo-requisicao-sub-item.component';

describe('ConfirmarVinculoRequisicaoSubItemComponent', () => {
  let component: ConfirmarVinculoRequisicaoSubItemComponent;
  let fixture: ComponentFixture<ConfirmarVinculoRequisicaoSubItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarVinculoRequisicaoSubItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarVinculoRequisicaoSubItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
