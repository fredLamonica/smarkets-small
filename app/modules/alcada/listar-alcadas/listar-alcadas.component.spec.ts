import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarAlcadasComponent } from './listar-alcadas.component';

describe('ListarAlcadasComponent', () => {
  let component: ListarAlcadasComponent;
  let fixture: ComponentFixture<ListarAlcadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListarAlcadasComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAlcadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
