import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizTabComponent } from './matriz-tab.component';

describe('MatrizTabComponent', () => {
  let component: MatrizTabComponent;
  let fixture: ComponentFixture<MatrizTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrizTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrizTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
