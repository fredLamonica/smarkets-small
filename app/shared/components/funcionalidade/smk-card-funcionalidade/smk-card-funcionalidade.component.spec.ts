import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmkCardFuncionalidadeComponent } from './smk-card-funcionalidade.component';

describe('SmkCardFuncionalidadeComponent', () => {
  let component: SmkCardFuncionalidadeComponent;
  let fixture: ComponentFixture<SmkCardFuncionalidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmkCardFuncionalidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmkCardFuncionalidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
