import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarOrigemMaterialComponent } from './listar-origem-material.component';

describe('ListarOrigemMaterialComponent', () => {
  let component: ListarOrigemMaterialComponent;
  let fixture: ComponentFixture<ListarOrigemMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarOrigemMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarOrigemMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
