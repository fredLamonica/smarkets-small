import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmkModalValidacaoDeContaComponent } from './smk-modal-validacao-de-conta.component';

describe('SmkModalValidacaoDeContaComponent', () => {
  let component: SmkModalValidacaoDeContaComponent;
  let fixture: ComponentFixture<SmkModalValidacaoDeContaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmkModalValidacaoDeContaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmkModalValidacaoDeContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
