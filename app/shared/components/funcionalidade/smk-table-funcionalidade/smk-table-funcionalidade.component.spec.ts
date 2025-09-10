import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SmkTableFuncionalidadeComponent } from './smk-table-funcionalidade.component';

describe('TableFuncionalidadeComponent', () => {
  let component: SmkTableFuncionalidadeComponent;
  let fixture: ComponentFixture<SmkTableFuncionalidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmkTableFuncionalidadeComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmkTableFuncionalidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
