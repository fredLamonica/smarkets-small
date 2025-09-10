import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCategoriaMaterialComponent } from './manter-categoria-material.component';

describe('ManterCategoriaMaterialComponent', () => {
  let component: ManterCategoriaMaterialComponent;
  let fixture: ComponentFixture<ManterCategoriaMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCategoriaMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCategoriaMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
