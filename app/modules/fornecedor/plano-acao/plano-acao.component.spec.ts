import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoAcaoComponent } from './plano-acao.component';

describe('PlanoAcaoComponent', () => {
  let component: PlanoAcaoComponent;
  let fixture: ComponentFixture<PlanoAcaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoAcaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoAcaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
