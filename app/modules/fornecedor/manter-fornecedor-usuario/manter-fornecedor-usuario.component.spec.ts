import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterFornecedorUsuarioComponent } from './manter-fornecedor-usuario.component';

describe('ManterFornecedorUsuarioComponent', () => {
  let component: ManterFornecedorUsuarioComponent;
  let fixture: ComponentFixture<ManterFornecedorUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterFornecedorUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterFornecedorUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
