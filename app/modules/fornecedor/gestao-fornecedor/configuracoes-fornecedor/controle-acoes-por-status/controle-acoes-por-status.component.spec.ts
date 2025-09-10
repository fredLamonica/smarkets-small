import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleAcoesPorStatusComponent } from './controle-acoes-por-status.component';

describe('ControleAcoesPorStatusComponent', () => {
  let component: ControleAcoesPorStatusComponent;
  let fixture: ComponentFixture<ControleAcoesPorStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControleAcoesPorStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControleAcoesPorStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
