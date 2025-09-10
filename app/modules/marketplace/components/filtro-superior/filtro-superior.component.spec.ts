import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroSuperiorComponent } from './filtro-superior.component';

describe('FiltroSuperiorComponent', () => {
  let component: FiltroSuperiorComponent;
  let fixture: ComponentFixture<FiltroSuperiorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroSuperiorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroSuperiorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
