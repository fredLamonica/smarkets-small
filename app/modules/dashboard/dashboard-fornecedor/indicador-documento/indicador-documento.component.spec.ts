import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorDocumentoComponent } from './indicador-documento.component';

describe('IndicadorDocumentoComponent', () => {
  let component: IndicadorDocumentoComponent;
  let fixture: ComponentFixture<IndicadorDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
