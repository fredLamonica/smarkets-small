import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosGeraisCompradorComponent } from './dados-gerais-comprador.component';

describe('DadosGeraisCompradorComponent', () => {
  let component: DadosGeraisCompradorComponent;
  let fixture: ComponentFixture<DadosGeraisCompradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DadosGeraisCompradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosGeraisCompradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
