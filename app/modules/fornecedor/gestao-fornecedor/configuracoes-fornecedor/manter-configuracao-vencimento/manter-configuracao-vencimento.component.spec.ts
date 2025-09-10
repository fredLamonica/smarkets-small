import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterConfiguracaoVencimentoComponent } from './manter-configuracao-vencimento.component';

describe('ManterConfiguracaoVencimentoComponent', () => {
  let component: ManterConfiguracaoVencimentoComponent;
  let fixture: ComponentFixture<ManterConfiguracaoVencimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterConfiguracaoVencimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterConfiguracaoVencimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
