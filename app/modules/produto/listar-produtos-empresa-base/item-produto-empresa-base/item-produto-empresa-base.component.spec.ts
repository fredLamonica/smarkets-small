import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemProdutoEmpresaBaseComponent } from './item-produto-empresa-base.component';

describe('ItemProdutoHoldingComponent', () => {
  let component: ItemProdutoEmpresaBaseComponent;
  let fixture: ComponentFixture<ItemProdutoEmpresaBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemProdutoEmpresaBaseComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemProdutoEmpresaBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
