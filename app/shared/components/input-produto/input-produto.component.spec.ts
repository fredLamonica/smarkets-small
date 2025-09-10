import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputProdutoComponent } from './input-produto.component';

describe('InputProdutoComponent', () => {
  let component: InputProdutoComponent;
  let fixture: ComponentFixture<InputProdutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputProdutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
