import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitirAlterarPropostaComponent } from './permitir-alterar-proposta.component';

describe('PermitirAlterarPropostaComponent', () => {
  let component: PermitirAlterarPropostaComponent;
  let fixture: ComponentFixture<PermitirAlterarPropostaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermitirAlterarPropostaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermitirAlterarPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
