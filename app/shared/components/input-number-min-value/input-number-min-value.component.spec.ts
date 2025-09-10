import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InputNumberMinValueComponent } from './input-number-min-value.component';

describe('InputNumberMinValueComponent', () => {
  let component: InputNumberMinValueComponent;
  let fixture: ComponentFixture<InputNumberMinValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputNumberMinValueComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputNumberMinValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
