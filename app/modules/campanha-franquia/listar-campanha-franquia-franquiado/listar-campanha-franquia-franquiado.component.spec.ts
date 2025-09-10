import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCampanhaFranquiaFranquiadoComponent } from './listar-campanha-franquia-franquiado.component';

describe('ListarCampanhaFranquiaFranquiadoComponent', () => {
  let component: ListarCampanhaFranquiaFranquiadoComponent;
  let fixture: ComponentFixture<ListarCampanhaFranquiaFranquiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarCampanhaFranquiaFranquiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCampanhaFranquiaFranquiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
