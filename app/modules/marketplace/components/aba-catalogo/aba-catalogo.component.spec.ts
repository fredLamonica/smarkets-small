import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbaCatalogoComponent } from './aba-catalogo.component';

describe('AbaCatalogoComponent', () => {
  let component: AbaCatalogoComponent;
  let fixture: ComponentFixture<AbaCatalogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbaCatalogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbaCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
