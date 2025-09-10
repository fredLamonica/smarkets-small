import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularProdutoItemComponent } from './vincular-produto-item.component';

describe('VincularProdutoItemComponent', () => {
  let component: VincularProdutoItemComponent;
  let fixture: ComponentFixture<VincularProdutoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularProdutoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularProdutoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
