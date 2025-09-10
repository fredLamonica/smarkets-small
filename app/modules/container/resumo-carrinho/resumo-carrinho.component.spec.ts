import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumoCarrinhoComponent } from './resumo-carrinho.component';

describe('ResumoCarrinhoComponent', () => {
  let component: ResumoCarrinhoComponent;
  let fixture: ComponentFixture<ResumoCarrinhoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumoCarrinhoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumoCarrinhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
