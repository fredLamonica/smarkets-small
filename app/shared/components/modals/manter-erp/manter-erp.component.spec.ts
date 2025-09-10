import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterErpComponent } from './manter-erp.component';

describe('ManterErpComponent', () => {
  let component: ManterErpComponent;
  let fixture: ComponentFixture<ManterErpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterErpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterErpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
