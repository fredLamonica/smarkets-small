import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarCategoriaComponent } from './selecionar-categoria.component';

describe('SelecionarCategoriaComponent', () => {
  let component: SelecionarCategoriaComponent;
  let fixture: ComponentFixture<SelecionarCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecionarCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionarCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
