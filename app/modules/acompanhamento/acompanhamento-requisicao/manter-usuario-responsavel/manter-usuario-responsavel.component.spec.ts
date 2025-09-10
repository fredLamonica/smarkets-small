import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterUsuarioResponsavelComponent } from './manter-usuario-responsavel.component';

describe('ManterUsuarioResponsavelComponent', () => {
  let component: ManterUsuarioResponsavelComponent;
  let fixture: ComponentFixture<ManterUsuarioResponsavelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterUsuarioResponsavelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterUsuarioResponsavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
