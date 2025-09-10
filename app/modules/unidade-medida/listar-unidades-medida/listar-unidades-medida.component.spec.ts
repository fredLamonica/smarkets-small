import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarUnidadesMedidaComponent } from './listar-unidades-medida.component';

describe('ListarUnidadesMedidaComponent', () => {
  let component: ListarUnidadesMedidaComponent;
  let fixture: ComponentFixture<ListarUnidadesMedidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarUnidadesMedidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarUnidadesMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
