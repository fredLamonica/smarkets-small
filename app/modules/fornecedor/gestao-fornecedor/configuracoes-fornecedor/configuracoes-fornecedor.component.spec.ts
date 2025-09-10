import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracoesFornecedorComponent } from './configuracoes-fornecedor.component';

describe('ConfiguracoesFornecedorComponent', () => {
  let component: ConfiguracoesFornecedorComponent;
  let fixture: ComponentFixture<ConfiguracoesFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracoesFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracoesFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
