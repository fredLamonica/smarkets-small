import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncluirCnaeComponent } from './incluir-cnae.component';

describe('IncluirCnaeComponent', () => {
  let component: IncluirCnaeComponent;
  let fixture: ComponentFixture<IncluirCnaeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncluirCnaeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncluirCnaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
