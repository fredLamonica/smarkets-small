import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularProdutoItemParticipanteComponent } from './vincular-produto-item-participante.component';

describe('VincularProdutoItemParticipanteComponent', () => {
  let component: VincularProdutoItemParticipanteComponent;
  let fixture: ComponentFixture<VincularProdutoItemParticipanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularProdutoItemParticipanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularProdutoItemParticipanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
