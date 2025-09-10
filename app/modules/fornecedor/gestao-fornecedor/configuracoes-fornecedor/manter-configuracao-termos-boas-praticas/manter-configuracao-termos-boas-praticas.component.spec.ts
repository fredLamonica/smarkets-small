import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterConfiguracaoTermosBoasPraticasComponent } from './manter-configuracao-termos-boas-praticas.component';

describe('ManterConfiguracaoTermosBoasPraticasComponent', () => {
  let component: ManterConfiguracaoTermosBoasPraticasComponent;
  let fixture: ComponentFixture<ManterConfiguracaoTermosBoasPraticasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterConfiguracaoTermosBoasPraticasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterConfiguracaoTermosBoasPraticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
