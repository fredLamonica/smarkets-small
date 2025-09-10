import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCategoriaMaterialComponent } from './listar-categoria-material.component';

describe('ListarCategoriaMaterialComponent', () => {
  let component: ListarCategoriaMaterialComponent;
  let fixture: ComponentFixture<ListarCategoriaMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarCategoriaMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCategoriaMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
