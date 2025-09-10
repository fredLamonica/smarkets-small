import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAlcadaUsuarioComponent } from './modal-alcada-usuario.component';

describe('ModalAlcadaUsuarioComponent', () => {
  let component: ModalAlcadaUsuarioComponent;
  let fixture: ComponentFixture<ModalAlcadaUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAlcadaUsuarioComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAlcadaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
