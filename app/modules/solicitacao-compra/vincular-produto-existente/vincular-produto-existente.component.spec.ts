import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularProdutoExistenteComponent } from './vincular-produto-existente.component';

describe('VincularProdutoExistenteComponent', () => {
  let component: VincularProdutoExistenteComponent;
  let fixture: ComponentFixture<VincularProdutoExistenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VincularProdutoExistenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VincularProdutoExistenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
