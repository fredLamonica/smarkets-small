import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCentrosCustoComponent } from './listar-centros-custo.component';

describe('ListarCentrosCustoComponent', () => {
  let component: ListarCentrosCustoComponent;
  let fixture: ComponentFixture<ListarCentrosCustoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarCentrosCustoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCentrosCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
