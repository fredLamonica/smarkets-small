import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaArquivosComponent } from './galeria-arquivos.component';

describe('GaleriaArquivosComponent', () => {
  let component: GaleriaArquivosComponent;
  let fixture: ComponentFixture<GaleriaArquivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaleriaArquivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaleriaArquivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
