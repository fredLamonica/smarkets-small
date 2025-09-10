import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterGrupoDespesaComponent } from './manter-grupo-despesa.component';

describe('ManterGrupoDespesaComponent', () => {
  let component: ManterGrupoDespesaComponent;
  let fixture: ComponentFixture<ManterGrupoDespesaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterGrupoDespesaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterGrupoDespesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
