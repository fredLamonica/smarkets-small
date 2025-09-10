import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterPessoaJuridicaComponent } from './manter-pessoa-juridica.component';

describe('ManterPessoaJuridicaComponent', () => {
  let component: ManterPessoaJuridicaComponent;
  let fixture: ComponentFixture<ManterPessoaJuridicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterPessoaJuridicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterPessoaJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
