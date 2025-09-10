import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterPlanoAcaoComponent } from './manter-plano-acao.component';

describe('ManterPlanoAcaoComponent', () => {
  let component: ManterPlanoAcaoComponent;
  let fixture: ComponentFixture<ManterPlanoAcaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterPlanoAcaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterPlanoAcaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
