import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionariosComponent } from './questionarios.component';

describe('QuestionariosComponent', () => {
  let component: QuestionariosComponent;
  let fixture: ComponentFixture<QuestionariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionariosComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
