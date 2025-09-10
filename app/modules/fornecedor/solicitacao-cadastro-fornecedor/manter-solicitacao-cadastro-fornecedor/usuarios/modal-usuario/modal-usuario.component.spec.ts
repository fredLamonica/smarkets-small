import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalUsuarioSolicitacaoFornecedorComponent } from './modal-usuario.component';

describe('ModalUsuarioSolicitacaoFornecedorComponent', () => {
  let component: ModalUsuarioSolicitacaoFornecedorComponent;
  let fixture: ComponentFixture<ModalUsuarioSolicitacaoFornecedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalUsuarioSolicitacaoFornecedorComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUsuarioSolicitacaoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
