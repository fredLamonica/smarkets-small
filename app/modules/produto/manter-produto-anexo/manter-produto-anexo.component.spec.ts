import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterProdutoAnexoComponent } from './manter-produto-anexo.component';

describe('ManterProdutoAnexoComponent', () => {
  let component: ManterProdutoAnexoComponent;
  let fixture: ComponentFixture<ManterProdutoAnexoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterProdutoAnexoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterProdutoAnexoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
