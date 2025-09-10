import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutosItensParticipanteComponent } from './produtos-itens-participante.component';

describe('ProdutosItensParticipanteComponent', () => {
  let component: ProdutosItensParticipanteComponent;
  let fixture: ComponentFixture<ProdutosItensParticipanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdutosItensParticipanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutosItensParticipanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
