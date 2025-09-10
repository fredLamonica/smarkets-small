import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClonarProdutosEmpresaBaseComponent } from './clonar-produtos-empresa-base.component';

describe('ClonarProdutosEmpresaBaseComponent', () => {
  let component: ClonarProdutosEmpresaBaseComponent;
  let fixture: ComponentFixture<ClonarProdutosEmpresaBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClonarProdutosEmpresaBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClonarProdutosEmpresaBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
