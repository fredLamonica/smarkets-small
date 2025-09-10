import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarProdutosEmpresaBaseComponent } from './listar-produtos-empresa-base.component';

describe('ListarProdutosHoldingComponent', () => {
  let component: ListarProdutosEmpresaBaseComponent;
  let fixture: ComponentFixture<ListarProdutosEmpresaBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListarProdutosEmpresaBaseComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarProdutosEmpresaBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
