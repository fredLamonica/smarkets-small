import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarVinculoProdutoComponent } from './confirmar-vinculo-produto.component';

describe('ConfirmarVinculoProdutoComponent', () => {
  let component: ConfirmarVinculoProdutoComponent;
  let fixture: ComponentFixture<ConfirmarVinculoProdutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarVinculoProdutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarVinculoProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
