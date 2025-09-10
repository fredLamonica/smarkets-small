import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionariosAdminComponent } from './questionarios-admin.component';

describe('QuestionariosAdminComponent', () => {
  let component: QuestionariosAdminComponent;
  let fixture: ComponentFixture<QuestionariosAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionariosAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionariosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
