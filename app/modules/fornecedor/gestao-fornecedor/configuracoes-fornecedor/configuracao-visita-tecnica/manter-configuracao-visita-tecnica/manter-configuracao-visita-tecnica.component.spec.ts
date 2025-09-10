import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterConfiguracaoVisitaTecnicaComponent } from './manter-configuracao-visita-tecnica.component';

describe('ManterConfiguracaoVisitaTecnicaComponent', () => {
  let component: ManterConfiguracaoVisitaTecnicaComponent;
  let fixture: ComponentFixture<ManterConfiguracaoVisitaTecnicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterConfiguracaoVisitaTecnicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterConfiguracaoVisitaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
