import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCotacaoComponent } from './manter-cotacao.component';

describe('ManterCotacaoComponent', () => {
  let component: ManterCotacaoComponent;
  let fixture: ComponentFixture<ManterCotacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCotacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCotacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
