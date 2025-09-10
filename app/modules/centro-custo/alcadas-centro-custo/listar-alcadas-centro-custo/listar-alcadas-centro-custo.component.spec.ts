import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarAlcadasCentroCustoComponent } from './listar-alcadas-centro-custo.component';

describe('ListarAlcadasComponent', () => {
  let component: ListarAlcadasCentroCustoComponent;
  let fixture: ComponentFixture<ListarAlcadasCentroCustoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarAlcadasCentroCustoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAlcadasCentroCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
