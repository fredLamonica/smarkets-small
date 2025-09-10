import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterOrigemMaterialComponent } from './manter-origem-material.component';

describe('ManterOrigemMaterialComponent', () => {
  let component: ManterOrigemMaterialComponent;
  let fixture: ComponentFixture<ManterOrigemMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterOrigemMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterOrigemMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
