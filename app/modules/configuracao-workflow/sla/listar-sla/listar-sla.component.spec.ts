import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSlaComponent } from './listar-sla.component';

describe('ListarSlaComponent', () => {
  let component: ListarSlaComponent;
  let fixture: ComponentFixture<ListarSlaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarSlaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarSlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
