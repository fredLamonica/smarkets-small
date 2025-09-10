import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SmkFiltroFuncionalidadeComponent } from './smk-filtro-funcionalidade.component';

describe('SmkFiltroFuncionalidadeComponent', () => {
  let component: SmkFiltroFuncionalidadeComponent;
  let fixture: ComponentFixture<SmkFiltroFuncionalidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmkFiltroFuncionalidadeComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmkFiltroFuncionalidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
