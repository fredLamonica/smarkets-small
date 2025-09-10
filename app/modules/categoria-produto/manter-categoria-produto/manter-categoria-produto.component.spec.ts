import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCategoriaProdutoComponent } from './manter-categoria-produto.component';

describe('ManterCategoriaProdutoComponent', () => {
  let component: ManterCategoriaProdutoComponent;
  let fixture: ComponentFixture<ManterCategoriaProdutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCategoriaProdutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCategoriaProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
