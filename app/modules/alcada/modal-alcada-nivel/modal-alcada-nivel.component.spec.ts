import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAlcadaNivelComponent } from './modal-alcada-nivel.component';

describe('ModalAlcadaNivelComponent', () => {
  let component: ModalAlcadaNivelComponent;
  let fixture: ComponentFixture<ModalAlcadaNivelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAlcadaNivelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAlcadaNivelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
