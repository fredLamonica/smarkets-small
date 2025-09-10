import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SmkTituloFuncionalidadeComponent } from './smk-titulo-funcionalidade.component';

describe('TituloFuncionalidadeComponent', () => {
  let component: SmkTituloFuncionalidadeComponent;
  let fixture: ComponentFixture<SmkTituloFuncionalidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmkTituloFuncionalidadeComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmkTituloFuncionalidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
