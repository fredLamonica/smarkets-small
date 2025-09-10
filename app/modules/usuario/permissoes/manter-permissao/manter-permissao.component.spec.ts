import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterPermissaoComponent } from './manter-permissao.component';

describe('ManterPermissaoComponent', () => {
  let component: ManterPermissaoComponent;
  let fixture: ComponentFixture<ManterPermissaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterPermissaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterPermissaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
