import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarOrganizacaoCompraComponent } from './listar-organizacao-compra.component';

describe('ListarOrganizacaoCompraComponent', () => {
  let component: ListarOrganizacaoCompraComponent;
  let fixture: ComponentFixture<ListarOrganizacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarOrganizacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarOrganizacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
