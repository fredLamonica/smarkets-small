import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroRequisicaoComponent } from './filtro-requisicao.component';

describe('FiltroRequisicaoComponent', () => {
  let component: FiltroRequisicaoComponent;
  let fixture: ComponentFixture<FiltroRequisicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroRequisicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroRequisicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
