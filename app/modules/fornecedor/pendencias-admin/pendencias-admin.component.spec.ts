import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendenciasAdminComponent } from './pendencias-admin.component';

describe('PendenciasAdminComponent', () => {
  let component: PendenciasAdminComponent;
  let fixture: ComponentFixture<PendenciasAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendenciasAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendenciasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
