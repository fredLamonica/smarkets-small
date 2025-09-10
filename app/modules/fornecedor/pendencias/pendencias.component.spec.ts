import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendenciasComponent } from './pendencias.component';

describe('PendenciasFornecedorComponent', () => {
  let component: PendenciasComponent;
  let fixture: ComponentFixture<PendenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PendenciasComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
