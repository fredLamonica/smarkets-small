import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTreeComponent } from './input-tree.component';

describe('InputTreeComponent', () => {
  let component: InputTreeComponent;
  let fixture: ComponentFixture<InputTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
