import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacoesPadraoComponent } from './observacoes-padrao.component';

describe('ObservacoesPadraoComponent', () => {
  let component: ObservacoesPadraoComponent;
  let fixture: ComponentFixture<ObservacoesPadraoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacoesPadraoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacoesPadraoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
