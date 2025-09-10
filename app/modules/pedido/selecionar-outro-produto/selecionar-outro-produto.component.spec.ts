import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarOutroProdutoComponent } from './selecionar-outro-produto.component';

describe('SelecionarOutroProdutoComponent', () => {
  let component: SelecionarOutroProdutoComponent;
  let fixture: ComponentFixture<SelecionarOutroProdutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecionarOutroProdutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionarOutroProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
