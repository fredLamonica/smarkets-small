import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTiposDepesaComponent } from './listar-tipos-depesa.component';

describe('ListarTiposDepesaComponent', () => {
  let component: ListarTiposDepesaComponent;
  let fixture: ComponentFixture<ListarTiposDepesaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarTiposDepesaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarTiposDepesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
