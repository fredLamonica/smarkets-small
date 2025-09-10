import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDomiciliosBancariosComponent } from './listar-domicilios-bancarios.component';

describe('ListarDomiciliosBancariosComponent', () => {
  let component: ListarDomiciliosBancariosComponent;
  let fixture: ComponentFixture<ListarDomiciliosBancariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarDomiciliosBancariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarDomiciliosBancariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
