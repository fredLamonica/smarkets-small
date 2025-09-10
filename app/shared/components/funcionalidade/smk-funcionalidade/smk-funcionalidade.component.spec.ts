import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmkManterFuncionalidadeComponent } from './smk-manter-funcionalidade.component';

describe('SmkManterFuncionalidadeComponent', () => {
  let component: SmkManterFuncionalidadeComponent;
  let fixture: ComponentFixture<SmkManterFuncionalidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmkManterFuncionalidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmkManterFuncionalidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
