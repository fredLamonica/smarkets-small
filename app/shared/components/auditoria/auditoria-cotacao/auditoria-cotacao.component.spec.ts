import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaCotacaoComponent } from './auditoria-cotacao.component';

describe('AuditoriaCotacaoComponent', () => {
  let component: AuditoriaCotacaoComponent;
  let fixture: ComponentFixture<AuditoriaCotacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriaCotacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaCotacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
