import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmkValidacaoDeContaComponent } from './smk-validacao-de-conta.component';

describe('ValidacaoDeContaComponent', () => {
  let component: SmkValidacaoDeContaComponent;
  let fixture: ComponentFixture<SmkValidacaoDeContaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmkValidacaoDeContaComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmkValidacaoDeContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
