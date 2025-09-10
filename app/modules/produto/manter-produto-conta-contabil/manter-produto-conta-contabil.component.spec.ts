import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterProdutoContaContabilComponent } from './manter-produto-conta-contabil.component';

describe('ManterProdutoContaContabilComponent', () => {
  let component: ManterProdutoContaContabilComponent;
  let fixture: ComponentFixture<ManterProdutoContaContabilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterProdutoContaContabilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterProdutoContaContabilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
