import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManterAlcadaCentroCustoComponent } from './manter-alcada-centro-custo.component';

describe('ManterAlcadaCentroCustoComponent', () => {
  let component: ManterAlcadaCentroCustoComponent;
  let fixture: ComponentFixture<ManterAlcadaCentroCustoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterAlcadaCentroCustoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterAlcadaCentroCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
