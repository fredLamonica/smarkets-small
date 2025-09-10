import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SmkListarFuncionalidadeComponent } from './smk-listar-funcionalidade.component';

describe('ListarFuncionalidadeComponent', () => {
  let component: SmkListarFuncionalidadeComponent;
  let fixture: ComponentFixture<SmkListarFuncionalidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmkListarFuncionalidadeComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmkListarFuncionalidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
