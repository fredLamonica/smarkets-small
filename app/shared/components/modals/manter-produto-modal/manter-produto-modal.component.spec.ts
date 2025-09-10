import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterProdutoModalComponent } from './manter-produto-modal.component';

describe('ManterProdutoModalComponent', () => {
  let component: ManterProdutoModalComponent;
  let fixture: ComponentFixture<ManterProdutoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterProdutoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterProdutoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
