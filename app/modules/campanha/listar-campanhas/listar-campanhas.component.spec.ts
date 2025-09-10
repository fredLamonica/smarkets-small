import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCampanhasComponent } from './listar-campanhas.component';

describe('ListarCampanhasComponent', () => {
  let component: ListarCampanhasComponent;
  let fixture: ComponentFixture<ListarCampanhasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarCampanhasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCampanhasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
