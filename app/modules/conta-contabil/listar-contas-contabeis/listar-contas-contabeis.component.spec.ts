import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarContasContabeisComponent } from './listar-contas-contabeis.component';

describe('ListarContasContabeisComponent', () => {
  let component: ListarContasContabeisComponent;
  let fixture: ComponentFixture<ListarContasContabeisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarContasContabeisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarContasContabeisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
