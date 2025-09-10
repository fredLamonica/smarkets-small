import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEnderecosComponent } from './listar-enderecos.component';

describe('ListarEnderecosComponent', () => {
  let component: ListarEnderecosComponent;
  let fixture: ComponentFixture<ListarEnderecosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarEnderecosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarEnderecosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
