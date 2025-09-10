import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterMarcaComponent } from './manter-marca.component';

describe('ManterMarcaComponent', () => {
  let component: ManterMarcaComponent;
  let fixture: ComponentFixture<ManterMarcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterMarcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
