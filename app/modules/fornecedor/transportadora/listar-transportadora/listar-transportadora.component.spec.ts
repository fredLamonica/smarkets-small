import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTransportadoraComponent } from './listar-transportadora.component';

describe('ListarTransportadoraComponent', () => {
  let component: ListarTransportadoraComponent;
  let fixture: ComponentFixture<ListarTransportadoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarTransportadoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarTransportadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
