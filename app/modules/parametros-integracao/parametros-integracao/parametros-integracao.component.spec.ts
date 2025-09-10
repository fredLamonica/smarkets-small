import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosIntegracaoComponent } from './parametros-integracao.component';

describe('ParametrosIntegracaoComponent', () => {
  let component: ParametrosIntegracaoComponent;
  let fixture: ComponentFixture<ParametrosIntegracaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosIntegracaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosIntegracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
