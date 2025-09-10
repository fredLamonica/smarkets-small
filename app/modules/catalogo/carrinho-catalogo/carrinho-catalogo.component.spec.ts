import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrinhoCatalogoComponent } from './carrinho-catalogo.component';

describe('CarrinhoCatalogoComponent', () => {
  let component: CarrinhoCatalogoComponent;
  let fixture: ComponentFixture<CarrinhoCatalogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrinhoCatalogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrinhoCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
