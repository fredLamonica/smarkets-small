import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCnaesComponent } from './listar-cnaes.component';

describe('ListarCnaesComponent', () => {
  let component: ListarCnaesComponent;
  let fixture: ComponentFixture<ListarCnaesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarCnaesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCnaesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
