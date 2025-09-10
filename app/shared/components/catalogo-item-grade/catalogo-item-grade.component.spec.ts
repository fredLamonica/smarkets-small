import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoItemGradeComponent } from './catalogo-item-grade.component';

describe('CatalogoItemGradeComponent', () => {
  let component: CatalogoItemGradeComponent;
  let fixture: ComponentFixture<CatalogoItemGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoItemGradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoItemGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
