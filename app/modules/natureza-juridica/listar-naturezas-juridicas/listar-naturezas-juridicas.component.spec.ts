import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarNaturezasJuridicasComponent } from './listar-naturezas-juridicas.component';

describe('ListarNaturezasJuridicasComponent', () => {
  let component: ListarNaturezasJuridicasComponent;
  let fixture: ComponentFixture<ListarNaturezasJuridicasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarNaturezasJuridicasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarNaturezasJuridicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
