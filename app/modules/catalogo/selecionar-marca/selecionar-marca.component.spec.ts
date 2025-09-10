import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarMarcaComponent } from './selecionar-marca.component';

describe('SelecionarMarcaComponent', () => {
  let component: SelecionarMarcaComponent;
  let fixture: ComponentFixture<SelecionarMarcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecionarMarcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionarMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
