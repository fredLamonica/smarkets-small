import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarValorReferenciaComponent } from './alterar-valor-referencia.component';

describe('AlterarValorReferenciaComponent', () => {
  let component: AlterarValorReferenciaComponent;
  let fixture: ComponentFixture<AlterarValorReferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlterarValorReferenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterarValorReferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
