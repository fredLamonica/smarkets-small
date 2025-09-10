import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMatrizResponsabilidadeComponent } from './modal-matriz-responsabilidade.component';

describe('ModalMatrizResponsabilidadeComponent', () => {
  let component: ModalMatrizResponsabilidadeComponent;
  let fixture: ComponentFixture<ModalMatrizResponsabilidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMatrizResponsabilidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMatrizResponsabilidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
