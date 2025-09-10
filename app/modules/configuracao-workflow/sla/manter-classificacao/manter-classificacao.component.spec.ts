import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterClassificacaoComponent } from './manter-classificacao.component';

describe('ManterClassificacaoComponent', () => {
  let component: ManterClassificacaoComponent;
  let fixture: ComponentFixture<ManterClassificacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterClassificacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterClassificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
