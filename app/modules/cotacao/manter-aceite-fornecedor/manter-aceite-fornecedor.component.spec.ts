import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterAceiteFornecedorComponent } from './manter-aceite-fornecedor.component';

describe('ManterAceiteFornecedorComponent', () => {
  let component: ManterAceiteFornecedorComponent;
  let fixture: ComponentFixture<ManterAceiteFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterAceiteFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterAceiteFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
