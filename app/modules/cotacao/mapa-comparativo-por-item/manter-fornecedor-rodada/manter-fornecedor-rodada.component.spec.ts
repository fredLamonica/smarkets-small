import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterFornecedorRodadaComponent } from './manter-fornecedor-rodada.component';

describe('ManterFornecedorRodadaComponent', () => {
  let component: ManterFornecedorRodadaComponent;
  let fixture: ComponentFixture<ManterFornecedorRodadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterFornecedorRodadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterFornecedorRodadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
