import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFluxoIntegracaoErpComponent } from './listar-fluxo-integracao-erp.component';

describe('ListarFluxoIntegracaoErpComponent', () => {
  let component: ListarFluxoIntegracaoErpComponent;
  let fixture: ComponentFixture<ListarFluxoIntegracaoErpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarFluxoIntegracaoErpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarFluxoIntegracaoErpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
