import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarPessoaJuridicaSmarketsComponent } from './listar-pessoa-juridica-smarkets.component';

describe('ListarPessoaJuridicaSmarketsComponent', () => {
  let component: ListarPessoaJuridicaSmarketsComponent;
  let fixture: ComponentFixture<ListarPessoaJuridicaSmarketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListarPessoaJuridicaSmarketsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPessoaJuridicaSmarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
