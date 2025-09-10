import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPendenciasComponent } from './listar-pendencias.component';

describe('ListarPendenciasComponent', () => {
  let component: ListarPendenciasComponent;
  let fixture: ComponentFixture<ListarPendenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarPendenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPendenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
