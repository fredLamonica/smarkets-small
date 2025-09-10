/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCargaImagemComponent } from './listar-carga-imagem.component';

describe('ListarCargaImagemComponent', () => {
  let component: ListarCargaImagemComponent;
  let fixture: ComponentFixture<ListarCargaImagemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListarCargaImagemComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCargaImagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
