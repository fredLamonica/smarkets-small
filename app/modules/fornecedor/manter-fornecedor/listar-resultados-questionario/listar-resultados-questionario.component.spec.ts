import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarResultadosQuestionarioComponent } from './listar-resultados-questionario.component';

describe('ListarResultadosQuestionarioComponent', () => {
  let component: ListarResultadosQuestionarioComponent;
  let fixture: ComponentFixture<ListarResultadosQuestionarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarResultadosQuestionarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarResultadosQuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
