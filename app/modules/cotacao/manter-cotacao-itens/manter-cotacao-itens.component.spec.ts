import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCotacaoItensComponent } from './manter-cotacao-itens.component';

describe('ManterCotacaoItensComponent', () => {
  let component: ManterCotacaoItensComponent;
  let fixture: ComponentFixture<ManterCotacaoItensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCotacaoItensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCotacaoItensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
