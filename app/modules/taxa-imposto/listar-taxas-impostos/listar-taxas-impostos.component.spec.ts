import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTaxasImpostosComponent } from './listar-taxas-impostos.component';

describe('ListarTaxasImpostosComponent', () => {
  let component: ListarTaxasImpostosComponent;
  let fixture: ComponentFixture<ListarTaxasImpostosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarTaxasImpostosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarTaxasImpostosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
