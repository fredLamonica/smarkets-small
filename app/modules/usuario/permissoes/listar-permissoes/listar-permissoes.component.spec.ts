import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPermissoesComponent } from './listar-permissoes.component';

describe('ListarPermissoesComponent', () => {
  let component: ListarPermissoesComponent;
  let fixture: ComponentFixture<ListarPermissoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarPermissoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPermissoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
