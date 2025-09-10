import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoAcaoAdminComponent } from './plano-acao-admin.component';

describe('PlanoAcaoAdminComponent', () => {
  let component: PlanoAcaoAdminComponent;
  let fixture: ComponentFixture<PlanoAcaoAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoAcaoAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoAcaoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
