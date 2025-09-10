import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterUsuarioModalComponent } from './manter-usuario-modal.component';

describe('ManterUsuarioModalComponent', () => {
  let component: ManterUsuarioModalComponent;
  let fixture: ComponentFixture<ManterUsuarioModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterUsuarioModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterUsuarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
