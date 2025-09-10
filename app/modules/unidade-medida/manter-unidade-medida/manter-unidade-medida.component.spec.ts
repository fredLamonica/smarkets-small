import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterUnidadeMedidaComponent } from './manter-unidade-medida.component';

describe('ManterUnidadeMedidaComponent', () => {
  let component: ManterUnidadeMedidaComponent;
  let fixture: ComponentFixture<ManterUnidadeMedidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterUnidadeMedidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterUnidadeMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
