import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoAceiteTermosComponent } from './historico-aceite-termos.component';

describe('HistoricoAceiteTermosComponent', () => {
  let component: HistoricoAceiteTermosComponent;
  let fixture: ComponentFixture<HistoricoAceiteTermosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoAceiteTermosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoAceiteTermosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
