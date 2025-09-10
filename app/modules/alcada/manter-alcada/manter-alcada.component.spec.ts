import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterAlcadaComponent } from './manter-alcada.component';

describe('ManterAlcadaComponent', () => {
  let component: ManterAlcadaComponent;
  let fixture: ComponentFixture<ManterAlcadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterAlcadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterAlcadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
