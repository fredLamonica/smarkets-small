import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterProdutoMarcaComponent } from './manter-produto-marca.component';

describe('ManterProdutoMarcaComponent', () => {
  let component: ManterProdutoMarcaComponent;
  let fixture: ComponentFixture<ManterProdutoMarcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterProdutoMarcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterProdutoMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
