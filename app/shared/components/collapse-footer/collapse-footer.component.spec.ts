import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapseFooterComponent } from './collapse-footer.component';

describe('CollapseFooterComponent', () => {
  let component: CollapseFooterComponent;
  let fixture: ComponentFixture<CollapseFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollapseFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapseFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
