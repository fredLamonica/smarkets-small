import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarConfiguracaoVisitaTecnicaComponent } from './listar-configuracao-visita-tecnica.component';

describe('ListarConfiguracaoVisitaTecnicaComponent', () => {
  let component: ListarConfiguracaoVisitaTecnicaComponent;
  let fixture: ComponentFixture<ListarConfiguracaoVisitaTecnicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarConfiguracaoVisitaTecnicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarConfiguracaoVisitaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
