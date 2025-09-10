import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarIvaComponent } from './listar-iva.component';

describe('ListarIvaComponent', () => {
  let component: ListarIvaComponent;
  let fixture: ComponentFixture<ListarIvaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarIvaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarIvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
