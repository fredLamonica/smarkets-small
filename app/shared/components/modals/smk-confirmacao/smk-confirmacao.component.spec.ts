import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmkConfirmacaoComponent } from './smk-confirmacao.component';

describe('SmkConfirmacaoComponent', () => {
  let component: SmkConfirmacaoComponent;
  let fixture: ComponentFixture<SmkConfirmacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmkConfirmacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmkConfirmacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
