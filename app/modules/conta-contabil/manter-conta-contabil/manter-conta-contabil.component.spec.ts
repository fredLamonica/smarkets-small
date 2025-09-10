import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterContaContabilComponent } from './manter-conta-contabil.component';

describe('ManterContaContabilComponent', () => {
  let component: ManterContaContabilComponent;
  let fixture: ComponentFixture<ManterContaContabilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterContaContabilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterContaContabilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
