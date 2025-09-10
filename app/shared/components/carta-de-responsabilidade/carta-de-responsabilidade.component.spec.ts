/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CartaDeResponsabilidadeComponent } from './carta-de-responsabilidade.component';

describe('CartaDeResponsabilidadeComponent', () => {
  let component: CartaDeResponsabilidadeComponent;
  let fixture: ComponentFixture<CartaDeResponsabilidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartaDeResponsabilidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartaDeResponsabilidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
