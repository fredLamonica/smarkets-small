import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmkBarraAcoesFuncionalidadeComponent } from './smk-barra-acoes-funcionalidade.component';

describe('SmkBarraAcoesFuncionalidadeComponent', () => {
  let component: SmkBarraAcoesFuncionalidadeComponent;
  let fixture: ComponentFixture<SmkBarraAcoesFuncionalidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmkBarraAcoesFuncionalidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmkBarraAcoesFuncionalidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
