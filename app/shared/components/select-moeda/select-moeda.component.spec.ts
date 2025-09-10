import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMoedaComponent } from './select-moeda.component';

describe('SelectMoedaComponent', () => {
  let component: SelectMoedaComponent;
  let fixture: ComponentFixture<SelectMoedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMoedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMoedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
