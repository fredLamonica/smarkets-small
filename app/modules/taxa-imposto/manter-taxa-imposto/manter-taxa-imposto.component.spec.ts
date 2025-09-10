import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterTaxaImpostoComponent } from './manter-taxa-imposto.component';

describe('ManterTaxaImpostoComponent', () => {
  let component: ManterTaxaImpostoComponent;
  let fixture: ComponentFixture<ManterTaxaImpostoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterTaxaImpostoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterTaxaImpostoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
