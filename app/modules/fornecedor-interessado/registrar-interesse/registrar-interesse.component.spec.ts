import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarInteresseComponent } from './registrar-interesse.component';

describe('RegistrarInteresseComponent', () => {
  let component: RegistrarInteresseComponent;
  let fixture: ComponentFixture<RegistrarInteresseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarInteresseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarInteresseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
