import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterOrganizacaoCompraComponent } from './manter-organizacao-compra.component';

describe('ManterOrganizacaoCompraComponent', () => {
  let component: ManterOrganizacaoCompraComponent;
  let fixture: ComponentFixture<ManterOrganizacaoCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterOrganizacaoCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterOrganizacaoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
