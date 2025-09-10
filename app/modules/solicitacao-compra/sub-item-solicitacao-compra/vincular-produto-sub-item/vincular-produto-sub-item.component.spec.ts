import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularProdutoSubItemComponent } from './vincular-produto-sub-item.component';

describe('VincularProdutoSubItemComponent', () => {
  let component: VincularProdutoSubItemComponent;
  let fixture: ComponentFixture<VincularProdutoSubItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularProdutoSubItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularProdutoSubItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
